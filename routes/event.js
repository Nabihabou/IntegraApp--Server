var mongoose = require('mongoose');
var models = require('../models');
var jwt = require('jsonwebtoken');
var config = require('../config');
var helpers = require('../helpers');


var Event = mongoose.model('Event');
var Profile = mongoose.model('Profile');
var Project = mongoose.model('Project');

module.exports = {
  get: function(req, res) {
    if (!req.query.id) {
      Event.find({}, helpers.client.findAll(req, res, "Event"));
    }
    else {
      Event.find({_id: req.query.id}, helpers.client.findOne(req, res, "Event"));
    }
  },
  post: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, obj) {
      if (obj) {
        var new_event = new Event({
          title: req.body.title,
          author: obj._id,
          place: req.body.place,
          project: mongoose.Types.ObjectId(req.body.project),
          startTime: new Date(req.body.startTime),
          endTime: new Date(req.body.endTime)
        });

        new_event.save(function(err, obj) {
          if(err) {
            console.log("Something went wrong: " + err);
            res.status(500).send("Something went wrong: " + err);
            res.end();
          }
          else {
            Project.update({_id: req.body.project}, {$push: {events: obj._id}}, function(err, project) {
              if (err) {
                console.log("Something went wrong: " + err);
                res.status(500).send("Something went wrong: " + err);
                res.end();
              }
              else {
                console.log("An event was created: ");
                console.log(JSON.stringify(obj));
                res.json(obj);
              }
            });
          }
        });
      }
    });
  },
  count: function(req, res) {
    Event.count({}, helpers.client.count(req, res, "Event"));
  },
  many: function(req, res) {
    if(req.body.ids) {
      Event.find({_id: {$in: req.body.ids}}, helpers.client.findAll(req, res, "Event"));
    }
  },
  delete: function(req ,res) {
    // TODO => retirar evento de projed
    Event.findOne({$or: [{_id: req.body.id}, {title: req.body.title}]}, function(err, event) {
      if (err) {
        console.log("Something went wrong: " + err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      } else if(event) {
        console.log(event);
        Project.update({_id: event.project}, {$pop: {events: event._id}}, function(err, project) {
          if (err) {
            console.log("Something went wrong: " + err);
            res.status(500).send("Something went wrong: " + err);
            res.end();
          }
          else {
            console.log("Removed event from project.");
            console.log(project);
          }
        });
      }
      else {
        console.log("No event found.");
      }
    }).remove(function(err, obj) {
      if (err) {
        console.log("Something went wrong: " + err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      }
      else if(obj.result.n !== 0 ){
        res.send("Deleted event: " + (req.body.title || req.body.id));
        res.end();
      }
      else {
        res.send("Event not found: " + (req.body.title || req.body.id));
        res.end();
      }
    });
  }
}