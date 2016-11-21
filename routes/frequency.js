module.exports = {
  get: function(req, res) {
    var googleParams = {google_id: req.query.id, google_email: req.query.email};
    Profile.findOne(googleParams, helpers.client.findOne(req, res, "Frequency"));
  }
}