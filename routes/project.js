var mongoose = require('mongoose');
var models = require('../models');

var Profile = mongoose.model('Profile');
var Project = mongoose.model('Project');

module.exports = {
  getAll: function(req, res) {
    Project.find({}, function(err, projects) {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      } else {
        res.json(projects);
      }
    });
  },
  get: function(req, res) {
    if (!req.query.id) {
      res.json({
        status: -1,
        message: "Id not specified"
      });
    } else {
      Project.findOne({_id: req.query.id}, function(err, project) {
        if (err) {
          console.log(err);
          res.status(500).send("Something went wrong: " + err);
          res.end();
        } else {
          res.json(project);
        }
      });
    }
  },
  post: function(req, res) {
    Project.count({name: req.body.name}, function(err, count){
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      } else if (count == 0) {
        var new_project = new Project(req.body);

        new_project.save(function(err, project) {
          if (err) {
            console.log(err);
            res.status(500).send("Something went wrong: " + err);
            res.end();
          } else {
            console.log("A new project was created: " + project);
            res.json(project);
          }
        });
      }
      else {
        res.status(500).send("Project already exist!");
        res.end();
      }
    });
  },
  // id for the project, userId for user id
  addMember: function(req, res) {
    Project.findOne({_id: req.body.id})
    Project.update({_id: req.body.id}, {$addToSet: {members: {_id: mongoose.Types.ObjectId(req.body.userId), level: 0}}}, function(err, project) {
      if (err) {
        console.log("Something went wrong: " + err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      } else {
        res.json(project);
      }
    });
  }
}