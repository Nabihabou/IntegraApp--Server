var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var jwt = require('jsonwebtoken');
var helpers = require('../helpers')

var Frequency = mongoose.model('Frequency');
var Profile = mongoose.model('Profile');
var Project = mongoose.model('Project');

module.exports = {
  get: function(req, res) {
    Frequency.find({project: req.query.projectId}, helpers.client.findAll(req, res, "Frequency"));
  },
  post: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, object) {
      if(object && object.is_admin) {
        var new_freq = new Frequency({
          author: profileId,
          project: req.body.projectId,
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          duration: req.body.duration,
          date: req.body.date
        });

        new_freq.save(function(err, obj) {
          if(err) {
            console.log("Something went wrong: " + err);
            res.status(500).send("Something went wrong: " + err);
            res.end();
          }
          else {
            Project.update({_id: req.body.projectId}, {$push: {frequencies: obj._id}});
            console.log("A frequency was created: ");
            console.log(JSON.stringify(obj));
            res.json(obj);
          }
        });
      }
    });
  }
}