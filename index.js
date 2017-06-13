// request.get(link).on('response', function(response){})

// lib files
var express         = require('express');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var jwt             = require('jsonwebtoken');
var expressJwt      = require('express-jwt');
var request         = require('request');
var cors            = require('cors');
var multer          = require('multer');
var upload          = multer({dest: 'uploads/'});

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
app.use(bodyParser({uploadDir: './tmp/uploads', keepExtensions: true}));
app.use(cors());
app.use(function(req, res, next) {
  if(req.headers.authorization) {
    req.token = req.headers.authorization.split(' ')[1];
  }
  next();
});

app.use('/api', expressJwt({secret: config.secret}, {algorithms: 'RSA256'}));

mongoose.Promise = require('bluebird');
mongoose.connect(config.database);

// importing models
var Profile = mongoose.model("Profile");

app.get('/', function(req, res) {
  res.sendfile('./login.html');
})

// Auth
app.get('/auth', routes.auth);

app.get('/test', function(req, res) {
  res.json({message: "All right m8"});
});

app.post('/mirror', function(req ,res) {
  res.json(req.body);
});

app.post('/profile', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  console.log(req.body);
  res.json({'message': 'ok'});
})

// User
app.get('/api/profile', routes.profile.get);
app.get('/api/profile/count', routes.profile.count);
app.get('/api/profile/my', routes.profile.myProfile);
app.get('/api/profile/hours', routes.profile.hours);
app.get('/api/profile/all', routes.profile.getAll);
// pre-cadastrar usuario
app.post('/api/profile/many', routes.profile.getMany);
app.post('/api/profile', routes.profile.post);


// Project
app.get('/api/project', routes.project.get);
app.get('/api/project/count', routes.project.count);

app.get('/project', routes.project.get);
app.get('/project/count', routes.project.count);

app.get('/api/project/my', routes.project.myProjects);
app.delete('/api/project', routes.project.delete);
// requires profile, project and operation on body
app.put('/api/project/member', routes.project.postMember);
app.post('/api/project', routes.project.post);
app.get('/api/project/report', routes.project.report);


// Event
app.get('/api/event', routes.event.get);
app.get('/api/event/count', routes.event.count);
app.post('/api/event', routes.event.post);
app.delete('/api/event', routes.event.delete);
app.post('/api/event/many', routes.event.many);


app.get('/api/frequency', routes.frequency.get);
app.post('/api/frequency/many', routes.frequency.many);
app.post('/api/frequency', routes.frequency.post);
// send json on members and hours to modify/add
app.put('/api/frequency', routes.frequency.put);



// app.get('/api/request', routes.request.get);
// app.post('/api/request', routes.request.post);


app.use(express.static('static'));

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
