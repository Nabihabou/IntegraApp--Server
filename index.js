// request.get(link).on('response', function(response){})

// lib files
var express         = require('express');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var jwt             = require('jsonwebtoken');
var expressJwt      = require('express-jwt')
var cors            = require('cors');
var request         = require('request');

// Server files
var config          = require('./config');
var middlewares     = require('./middlewares');
var routes          = require('./routes')
var models          = require('./models');

// create main variables
var port    = process.env.PORT || 8080;
var app     = module.exports = express();

app.use(cors);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(middlewares.cos_configs);
app.use('/api', expressJwt({secret: config.secret}));

mongoose.Promise = require('bluebird');
mongoose.connect(config.database);

// importing models
var Profile = mongoose.model("Profile");

// Auth
app.post('/auth', routes.auth);
app.post('/mirror', function(req ,res) {
  console.log("yay");
  res.json(req.body);
})

// User
app.get('/api/profile', routes.profile.get);
app.get('/api/profile/count', routes.profile.count);
// pre-cadastrar usuario
// app.post('/api/profile', routes.profile.post);


// Project
app.get('/api/project', routes.project.get);
app.get('/api/project/count', routes.project.count);
// requires profile, project and operation on body
app.put('/api/project/member', routes.project.postMember);
app.post('/api/project', routes.project.post);


// Event
app.get('/api/event', routes.event.get);
app.get('/api/event/count', routes.event.count);
app.post('/api/event', routes.event.post);
app.delete('/api/event', routes.event.delete);


// app.get('/api/frequency', routes.frequency.get);
// app.post('/api/frequency', routes.frequency.post);
// send json on members and hours to modify/add
// app.put('/api/frequency', routes.frequency.put);



// app.get('/api/request', routes.request.get);
// app.post('/api/request', routes.request.post);




app.post('/mirror', function(req, res) {
  console.log(req.body);
  if (req.body.access_token) {
    console.log("Has token!");
    request.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + req.body.access_token, function(response, body) {
      console.log(body.body);
    })
  }
  res.json(req.body);
})

app.listen(port, function() {
  console.log("Listening on " + port);
})