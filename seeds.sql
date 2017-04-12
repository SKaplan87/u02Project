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

INSERT INTO gyms (name,address,img,price,bio) VALUES('Manhattan Physical Therapy & Pain Center','276 5th Ave #202, New York, NY 10001','http://dk6kcyuwrpkrj.cloudfront.net/wp-content/uploads/sites/45/2014/05/avatar-blank.jpg',20,'Small physical therapy studio with bare essentials for a vriety of styles');
INSERT INTO gyms (name,address,img,price,bio) VALUES('The Marc Gym','260 W 54th St, New York, NY 10019','http://dk6kcyuwrpkrj.cloudfront.net/wp-content/uploads/sites/45/2014/05/avatar-blank.jpg',0,'A gym just for residents of the building');
INSERT INTO gyms (name,address,img,price,bio) VALUES('241 Fifth','241 5th Ave, New York, NY 10016','http://dk6kcyuwrpkrj.cloudfront.net/wp-content/uploads/sites/45/2014/05/avatar-blank.jpg',0,'A gym just for residents of the building');
INSERT INTO gyms (name,address,img,price,bio) VALUES('New York Underground Fitness','440 W 57th St, New York, NY 10019','http://dk6kcyuwrpkrj.cloudfront.net/wp-content/uploads/sites/45/2014/05/avatar-blank.jpg',20,'Full Service Neighborhood Gym Specializing In High End Personal Training.');
INSERT INTO clients (name,address,img,birthday,charge) VALUES('Paul George','260 W 54th St, New York, NY 10019','http://dk6kcyuwrpkrj.cloudfront.net/wp-content/uploads/sites/45/2014/05/avatar-blank.jpg',to_date('19770101','YYYYMMDD'),75);
INSERT INTO clients (name,address,img,birthday,charge) VALUES('Marc Brookman','260 W 54th St, New York, NY 10019','http://dk6kcyuwrpkrj.cloudfront.net/wp-content/uploads/sites/45/2014/05/avatar-blank.jpg','19800201',100);
INSERT INTO clients (name,address,img,birthday,charge) VALUES('Peter Bonnano','213 Fake St, Massapequa, NY 11758','http://dk6kcyuwrpkrj.cloudfront.net/wp-content/uploads/sites/45/2014/05/avatar-blank.jpg','19700301',100);
INSERT INTO clients (name,address,img,birthday,charge) VALUES('Henry Meyerberg','241 5th Ave, New York, NY 10016','http://dk6kcyuwrpkrj.cloudfront.net/wp-content/uploads/sites/45/2014/05/avatar-blank.jpg','19670401',120);
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (1,1,to_date('20170405','YYYYMMDD'),'7:00AM');
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (2,1,to_date('20170405','YYYYMMDD'),'7:00AM');
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (3,1,to_date('20170405','YYYYMMDD'),'7:00AM');
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (4,1,to_date('20170405','YYYYMMDD'),'7:00AM');
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (1,4,to_date('20170405','YYYYMMDD'),'7:00PM');
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (2,4,to_date('20170405','YYYYMMDD'),'7:00PM');
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (3,3,to_date('20170405','YYYYMMDD'),'8:30AM');
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (4,3,to_date('20170405','YYYYMMDD'),'8:30AM');
INSERT INTO sessions (gym_id,client_id,date_of_session,time_of_session) VALUES (2,2,to_date('20170405','YYYYMMDD'),'7:00AM');
