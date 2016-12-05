module.exports = {
  get: function(req, res) {
    Profile.find({project: req.query.projectId}, helpers.client.findAll(req, res, "Frequency"));
  }
}