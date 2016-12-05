var mongoose = require('mongoose');
var models = require('../models');
var helpers = require('../helpers')

var Frequency = mongoose.model('Frequency');

module.exports = {
  get: function(req, res) {
    Frequency.find({project: req.query.projectId}, helpers.client.findAll(req, res, "Frequency"));
  }
}