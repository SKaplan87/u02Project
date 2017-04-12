DROP TABLE IF EXISTS CASCADE gyms;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS sessions;

CREATE TABLE users(
id SERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL,
password_hash TEXT NOT NULL
);

CREATE TABLE gyms(
  id SERIAL PRIMARY KEY,
  -- user_id INTEGER REFERENCES users(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  img TEXT NOT NULL,
  price INTEGER NOT NULL,
  bio TEXT NOT NULL
);

CREATE TABLE clients(
  id SERIAL PRIMARY KEY,
  -- user_id INTEGER REFERENCES users(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  img TEXT NOT NULL,
  birthday DATE NOT NULL,
  charge INTEGER NOT NULL
);


CREATE TABLE sessions(
  id SERIAL PRIMARY KEY,
  -- user_id INTEGER REFERENCES users(id) NOT NULL,
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  gym_id INTEGER REFERENCES gyms(id) NOT NULL,
  date_of_session DATE NOT NULL,
  time_of_session TIME NOT NULL
);

INSERT INTO gyms (name,address,img,price,bio) VALUES("The Muscle Gym","331 Lexington Ave, New York, NY 10016","https://i.ytimg.com/vi/oMsA0tpDsXg/maxresdefault.jpg",10,"The place to come if you want big muscles. You have small muscles, we make you have big muscles. MUSSSCCCCCLLLLEEESSS");
INSERT INTO gyms (name,address,img,price,bio) VALUES("Yoga for All","321 E 79th St, New York, NY 10075","http://squawalpine.com/sites/default/files/styles/large/public/media_yoga_studio_downdog.jpg?itok=Wd_MstRl",15,"Find your zen, find your flexibility, find you center. Yoga for All is Yoga for You!");
INSERT INTO gyms (name,address,img,price,bio) VALUES("Hans and Franz's Pump Palace","453 W 54th St, New York, NY 10019",,25,"Inspired by the greatest body builders of all time. Hans and Franz will PUMP you up.");
INSERT INTO gyms (name,address,img,price,bio) VALUES("Kickboxing Unlimited","85 Chambers St, New York, NY 10007",,20,"We don't teach self defense here. We teach self offense. No one will mess with you ever again.");
INSERT INTO clients (name,address,img,birthday,charge) VALUES(,,,,)
INSERT INTO clients (name,address,img,birthday,charge) VALUES(,,,,)
INSERT INTO clients (name,address,img,birthday,charge) VALUES(,,,,)
INSERT INTO clients (name,address,img,birthday,charge) VALUES(,,,,)
INSERT INTO clients (name,address,img,birthday,charge) VALUES(,,,,)
INSERT INTO clients (name,address,img,birthday,charge) VALUES(,,,,)
INSERT INTO clients (name,address,img,birthday,charge) VALUES(,,,,)
INSERT INTO clients (name,address,img,birthday,charge) VALUES(,,,,)
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (,to_date(,'YYYYMMDD'),);

