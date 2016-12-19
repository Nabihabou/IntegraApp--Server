var mongoose = require('mongoose');
var models = require('../models');
var jwt = require('jsonwebtoken');
var helpers = require('../helpers');
var config = require('../config');

var Profile = mongoose.model('Profile');
var Project = mongoose.model('Project');

var has_level = function(memberArray, desired_level, id) {
  for(var i = 0;i < memberArray.length;i++) {
    console.log(memberArray[i]._id, id);
    if(memberArray[i]._id == id) {
      return desired_level < memberArray[i].level;
    }
  }
}

module.exports = {
  get: function(req, res) {
    if (!req.query.id) {
      Project.find({}, helpers.client.findAll(req, res, "Project"));
    } else {
      Project.findOne({_id: req.query.id}, helpers.client.findOne(req, res, "Project"));
    }
  },
  myProjects: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, object) {
      if(object && object.is_admin) {
        Project.find({}, helpers.client.findAll(req, res, "Project"));
      } else if(object) {
        Project.find({_id: {$in: object.projects}}, helpers.client.findAll(req, res, "Project"));
      }
    });
  },
  delete: function(req, res) {
    if(req.body.id) {
      Project.remove({_id: req.body.id}, function(err) {
        if(err) {
          console.log(err);
          res.end();
        } else {
          console.log("Project deleted: " + req.body.id);
          Profile.update({}, {$pop: {projects: req.body.id}}, function(error, project) {
            if (error) {
              console.log(error);
              res.end();
            } else {
              res.json(project);
            }
          });
        }
      })
    }
  },
  post: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, object) {
      if(object && object.is_admin) {
        var new_project = new Project({
          name: req.body.name,
          description: req.body.description,
          logo: req.body.logo
        });

        new_project.save(function(err, obj) {
          if(err) {
            console.log("Something went wrong: " + err);
            res.status(500).send("Something went wrong: " + err);
            res.end();
          }
          else {
            console.log("A project was created: ");
            console.log(JSON.stringify(obj));
            res.json(obj);
          }
        });
      }
    });
  },
  // id for the project, userId for user id
  postMember: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, profile) {
      if (error) {
        console.log(error);
      } else if(profile) {
        Project.findOne({_id: req.body.project}, function(error, obj) {
          if(error) {
            console.log(error);
          } else if(obj) {
            if (has_level(obj.members, req.body.level, profileId) || profile.is_admin) {
              if (req.body.operation == "remove") {
                Project.update({_id: req.body.project}, {$pop: {members: {_id: mongoose.Types.ObjectId(req.body.profile), level: 0}}}, function(err, project) {
                  if (err) {
                    console.log("Something went wrong: " + err);
                    res.status(500).send("Something went wrong: " + err);
                    res.end();
                  } else {
                    Profile.update({_id: req.body.profile}, {$pop: {projects: req.body.project}}, function(error, obj) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log(obj);
                      }
                    });
                    res.json(project);
                  }
                });
              }
              else if(req.body.operation == "add"){
                Project.update({_id: req.body.project}, {$addToSet: {members: {_id: mongoose.Types.ObjectId(req.body.profile), level: req.body.level}}}, function(err, project) {
                  if (err) {
                    console.log("Something went wrong: " + err);
                    res.status(500).send("Something went wrong: " + err);
                    res.end();
                  } else {
                    Profile.update({_id: req.body.profile}, {$addToSet: {projects: mongoose.Types.ObjectId(req.body.project)}}, function(error, result) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log(result);
                      }
                    });
                    res.json(project);
                  }
                });
              }
              else {
                res.end();
              }
            }
            else {
              res.send("No access level");
              res.end();
            }
          }
        });
      } else {
        console.log("No profile found");
        res.end();
      }
    });
  },
  count: function(req, res) {
    Project.count({}, helpers.client.count(req, res, "Project"))
  }
}
