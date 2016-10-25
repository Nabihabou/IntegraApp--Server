// request.get(link).on('response', function(response){})

// lib files
var express         = require('express');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var jwt             = require('jsonwebtoken');
var expressJwt      = require('express-jwt')
var request         = require('request');

// Server files
var config          = require('./config');
var middlewares     = require('./middlewares');
var routes          = require('./routes')
var models          = require('./models');

// create main variables
var port    = process.env.PORT || 8080;
var app     = module.exports = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(middlewares.cos_configs);
app.use('/api', expressJwt({secret: config.secret}));

mongoose.Promise = require('bluebird');
mongoose.connect(config.database);

// importing models
var Profile = mongoose.model("Profile");

// get routes
app.get('/api/user', routes.user.get);
app.get('/api/project/all', routes.project.getAll);
app.get('/api/project', routes.project.get);

app.post('/api/project', routes.project.post);
app.post('/api/project/new/member', routes.project.addMember);
// app.post('/api/project/new/frequency', routes.project.addFrequency);
// app.post('/api/project/new/request', routes.project.addRequest);

app.post('/newUser', routes.user.post);
app.post('/login', routes.login);

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