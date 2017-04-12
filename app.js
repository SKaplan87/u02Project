const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const methodOverride = require('method-override');
const axios = require('axios');
app.use(methodOverride('_method'));
const moment = require('moment');
let time = moment().format("MMDDYYYY");


const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/html');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'fitnesspizza',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

var db = pgp('postgres://scottkaplan@localhost:5432/project2_practice');

app.get('/', function(req, res){
  if (req.session.user){
    let data = {
      "logged_in":true,
      "email":req.session.user.email
    };
    res.render('index',data);
  }
  else
  {
    res.render('index');
  }
});

app.post('/login', function(req, res){
  let data = req.body;
  db
    .one('SELECT * FROM users WHERE email=$1',[data.email])
    .then(function(user){
      bcrypt.compare(data.password,user.password_hash, function (err,comp){
        if (comp)
        {
          req.session.user=user;
          // db
          //   .any(SELECT)
          res.redirect('/');
        }
        else
        {
          res.send("Authorization Failed: Invalid Email/Password");
        }
      });
    })
    .catch(function(){
      res.send("Authorization Failed: Invalid Email/Password")});
    });

app.get('/signup', function(req, res){
  res.render('signup/index');
});

app.post('/signup', function(req, res){
  let data=req.body;
  bcrypt
    .hash(data.password,10, function(err, hash){
        db
        .none('INSERT INTO users (email,password_hash) VALUES($1,$2)',[data.email,hash])
        .then(function(){
          res.redirect("/");
        });
      });
  });


app.get('/logout', function(req, res){
  req.session.user=null;
  res.redirect('/');
});

app.get('/clients',function(req,res){
  db
    .any("SELECT * FROM clients ORDER BY name")
    .then(function(data){
      let clients={
        clients:data
      }
    res.render("clients/index",clients);
  })
});

app.get('/dashboard',function(req,res){
db
  .any("SELECT sessions.date_of_session as date,sessions.time_of_session as time,gyms.name as gym_name, clients.name as client_name FROM sessions LEFT JOIN gyms ON sessions.gym_id = gyms.id LEFT JOIN clients on sessions.client_id = clients.id WHERE date_of_session>CURRENT_DATE")
  .then(function(upcoming_sessions){
    db
      .any("SELECT clients.name as name, sum(clients.charge) as charge ,count(clients.charge) as sessions FROM sessions LEFT JOIN clients on sessions.client_id = clients.id GROUP BY clients.name ORDER BY charge DESC")
      .then(function(top_clients){
        db
          .any("SELECT gyms.name as name, count(price) as count FROM sessions LEFT JOIN gyms on sessions.gym_id = gyms.id GROUP BY gyms.name ORDER BY count DESC")
          .then(function(top_gyms){
            db
              .any("SELECT sum(clients.charge) as charge ,count(clients.charge) as sessions FROM sessions LEFT JOIN clients on sessions.client_id = clients.id WHERE EXTRACT(YEAR FROM date_of_session)=2017")
              .then(function(ytd){
              let allInfo={
                ytd:ytd,
                upcoming_sessions:upcoming_sessions,
                top_clients:top_clients,
                top_gyms:top_gyms
              }
    res.render("reports/index",allInfo);
    });
  });
  });
  });
});


app.get('/clients/:id',function(req,res){
  id=req.params.id;
  db
  .one("SELECT * FROM clients WHERE id=$1",[id])
  .then(function(client_data){
    db.
      any("SELECT sessions.id as session_id, sessions.date_of_session as date,sessions.time_of_session as time,gyms.name as gym_name, gyms.price as price, clients.charge as charge FROM sessions LEFT JOIN gyms ON sessions.gym_id = gyms.id LEFT JOIN clients on sessions.client_id = clients.id WHERE clients.id=$1",[id])
      .then(function(session_data){
        db.one("SELECT sum(charge) FROM sessions LEFT JOIN clients ON sessions.client_id = clients.id WHERE clients.id=$1",[id])
          .then(function(sum){
              db.one("SELECT count(charge) FROM sessions LEFT JOIN clients ON sessions.client_id = clients.id WHERE clients.id=$1",[id])
              .then(function(count){
          let allInfo={
            count:count.count,
            sum:sum.sum,
            id:client_data.id,
            name:client_data.name,
            address:client_data.address,
            birthday:moment(client_data.birthday).format("MM/DD/YYYY"),
            img:client_data.img,
            session:session_data,
            date_of_session:moment(session_data.date).format("MM/DD/YYYY")
          }
    res.render('clients/show',allInfo);
  });
    });
  });
});
});

app.get('/client/new',function(req,res){
  res.render('clients/new');
});

app.get('/client/update/:id',function(req,res){
  id=req.params.id;
  db
    .one("SELECT * FROM clients WHERE id=$1",[id])
    .then(function(data){
      let client={
        id:data.id,
        name:data.name,
        address:data.address,
        birthday:moment(data.birthday).format("MM/DD/YYYY"),
        img:data.img
      }
  res.render('clients/update',client);
});
});

app.put('/clients/:id', function(req, res) {
  id=req.params.id;
  name=req.body.name;
  address=req.body.address;
  img=req.body.img;
  birthday=req.body.birthday;
  db
    .none("UPDATE clients SET name = $1, address = $2, img = $3, birthday = $4  WHERE id = $5",[name,address,img,birthday,id])
    .then(function() {
      res.redirect('/clients');
    })
    .catch(function() {
      res.send('Fail.');
    })
});

app.put('/gyms/:id', function(req, res) {
  id=req.params.id;
  name=req.body.name;
  address=req.body.address;
  img=req.body.img;
  price=req.body.price;
  bio=req.body.bio;
  db
    .none("UPDATE gyms SET name = $1, address = $2, img = $3, price = $4, bio = $5  WHERE id = $6",[name,address,img,price,bio,id])
    .then(function() {
      res.redirect('/gyms');
    })
    .catch(function() {
      res.send('Fail.');
    })
});

app.put('/sessions/:id', function(req, res) {
  id=req.params.id;
  gym_id=req.body.gym_id;
  client_id=req.body.client_id;
  date_of_session=req.body.date_of_session;
  time_of_session=req.body.time_of_session;
  db
    .none("UPDATE sessions SET gym_id = $1, client_id = $2, date_of_session = $3, time_of_session = $4 WHERE id = $5",[gym_id,client_id,date_of_session,time_of_session,id])
    .then(function() {
      res.redirect('/sessions');
    })
    .catch(function() {
      res.send('Fail.');
    })
});

app.get('/client/delete/:id',function(req,res){
  id=req.params.id;
  db
    .one("SELECT * FROM clients WHERE id=$1",[id])
    .then(function(data){
      let client={
        id:data.id,
        name:data.name,
        address:data.address,
        birthday:data.birthday,
        img:data.img
      }
  res.render('clients/delete',client);
  });
});

app.get('/client/delete/yes/:id',function(req,res){
  id=req.params.id;
  db
    .none("DELETE FROM clients WHERE id=$1",[id]);
    res.redirect('/clients');
});

app.get('/gyms',function(req,res){
  db
    .any("SELECT * FROM gyms ORDER BY name")
    .then(function(data){
      let gyms={
        gyms:data
      }
    res.render("gyms/index",gyms);
  })
});


app.get('/gyms/:id',function(req,res){
  id=req.params.id;
  db
    .one("SELECT * FROM gyms WHERE id=$1",[id])
    .then(function(gym_data){
      db
        .any("SELECT gyms.id as gyms_id, sessions.id as session_id ,sessions.date_of_session as date,sessions.time_of_session as time,gyms.name as gym_name, clients.name as client_name, gyms.address as address, gyms.price as price, gyms.bio as bio, gyms.img as img, clients.charge as charge FROM sessions LEFT JOIN gyms ON sessions.gym_id = gyms.id LEFT JOIN clients on sessions.client_id = clients.id WHERE gyms.id=$1",[id])
        .then(function(session_data){
            let address=gym_data.address;
            let tempString=address.split(" ").join("+").toString();
            let urlString=tempString.substring(0,tempString.length-5);
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?address="+urlString+"&key=AIzaSyDY95K5QtqGvTgYomDgX6uvUadGTi6y7Mg")
            .then(function(res){
              return res;
            })
            .then(function(body){
              let allInfo={
                lat:body.data.results[0].geometry.location.lat,
                lng:body.data.results[0].geometry.location.lng,
                id:gym_data.id,
                name:gym_data.name,
                address:gym_data.address,
                price:gym_data.price,
                bio:gym_data.bio,
                img:gym_data.img,
                session:session_data,
                date_of_session:moment(session_data.date).format("MM-DD-YYYY")
          }
          res.render('gyms/show',allInfo);
      });
    })
  })
});

app.get('/gym/new',function(req,res){
  res.render('gyms/new');
  });

app.get('/gym/update/:id',function(req,res){
  id=req.params.id;
  db
    .one("SELECT * FROM gyms WHERE id=$1",[id])
    .then(function(data){
    let gym={
      id:data.id,
      name:data.name,
      address:data.address,
      img:data.img,
      price:data.price,
      bio:data.bio
    };
  res.render('gyms/update',gym);
  });
});

app.get('/gym/delete/:id',function(req,res){
  id=req.params.id;
  db
    .one("SELECT * FROM gyms WHERE id=$1",[id])
    .then(function(data){
      let gym={
        id:data.id,
        name:data.name,
        address:data.adress,
        img:data.img,
        price:data.price,
        bio:data.bio
      }
  res.render('gyms/delete',gym);
  });
});


app.get('/gym/delete/yes/:id',function(req,res){
  id=req.params.id;
  db.none("DELETE FROM gyms WHERE id=$1",[id]);
  res.redirect('/gyms');
});

app.get('/sessions',function(req,res){
  db
    .any("SELECT sessions.id,sessions.date_of_session,sessions.time_of_session,gyms.name as gym_name, clients.name as client_name, gyms.price as price, clients.charge as charge  FROM sessions LEFT JOIN gyms ON sessions.gym_id = gyms.id LEFT JOIN clients on sessions.client_id = clients.id")
    .then(function(data){
      let sessions={
        sessions:data,
        date:moment(data.date_of_session).format("MM-DD-YYYY")
      }
  res.render("sessions/index",sessions);

  });
});

  app.get('/sessions/:id',function(req,res){
  id=req.params.id;
  db
    .one("SELECT clients.charge as charge, gyms.price as price, sessions.id,sessions.date_of_session,sessions.time_of_session,gyms.name as gym_name, clients.name as client_name  FROM sessions LEFT JOIN gyms ON sessions.gym_id = gyms.id LEFT JOIN clients on sessions.client_id = clients.id WHERE sessions.id=$1",[id])
    .then(function(data){
        let session={
          id:data.id,
          client_name:data.client_name,
          gym_name:data.gym_name,
          date_of_session:moment(data.date_of_session).format("MM/DD/YYYY"),
          time_of_session:data.time_of_session,
          charge:data.charge,
          price:data.price
        }
    res.render('sessions/show',session);
  })
  });

app.get('/session/new',function(req,res){
  db
    .any("SELECT id, name FROM gyms")
    .then(function(gym_data){
      db
        .any("SELECT id,name FROM clients")
        .then(function(client_data){
          let allInfo={
            gyms:gym_data,
            clients:client_data
          }
        res.render('sessions/new',allInfo);
    });
  });
});



app.get('/session/update/:id',function(req,res){
  id=req.params.id;
  db
    .one("SELECT * FROM sessions WHERE id=$1",[id])
    .then(function(data){
      let session={
        id:data.id,
        client_id:data.client_id,
        gym_id:data.gym_id,
        date_of_session:data.date_of_session,
        time_of_session:data.time_of_session,
      }
  res.render('sessions/update',session);
    });
  });

app.get('/session/delete/:id',function(req,res){
  id=req.params.id;
  db
    .one("SELECT * FROM sessions WHERE id=$1",[id])
    .then(function(data){
      let session={
        id:data.id,
        client_id:data.client_id,
        gym_id:data.gym_id,
        date_of_session:data.date_of_session,
        time_of_session:data.time_of_session,
      }
  res.render('sessions/delete',session);
  });
});

app.get('/session/delete/yes/:id',function(req,res){
  id=req.params.id;
  db
    .none("DELETE FROM sessions WHERE id=$1",[id]);
    res.redirect('/sessions');
});

app.post('/clients', function(req,res){
  name=req.body.name;
  address=req.body.address;
  img=req.body.img;
  birthday=req.body.birthday;
  charge=req.body.charge;
  db
    .none("insert into clients(name,address,img,birthday,charge) values($1,$2,$3,$4,$5)",[name,address,img,birthday,charge])
    .then(function(data){
      res.redirect("clients/");
    })
})

app.post('/gyms', function(req,res){
  name=req.body.name;
  img=req.body.img;
  address=req.body.address;
  price=req.body.price;
  bio=req.body.bio;
  db
    .none("insert into gyms(name,img,address,price,bio) values($1,$2,$3,$4,$5)",[name,img,address,price,bio])
    .then(function(data){
      res.redirect("gyms");
    })
})

app.post('/sessions', function(req,res){
  client_id=req.body.client_id;
  gym_id=req.body.gym_id;
  date_of_session=req.body.date_of_session;
  time_of_session=req.body.time_of_session;
  db
    .none("insert into sessions(client_id,gym_id,date_of_session,time_of_session) values($1,$2,$3,$4)",[client_id,gym_id,date_of_session,time_of_session])
    .then(function(data){
      res.redirect("sessions");
    })
})

app.listen(3000, function () {
  console.log('Lets DO IT');
});




