module.exports = {
  get: function(req, res) {
    var googleParams = {google_id: req.query.id, google_email: req.query.email};
    Profile.findOne(googleParams, function(err, profile) {
      if(err) {
        console.log(err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      }
      else {
        if (profile) {
          console.log("Sent user data: " + JSON.stringify(profile));
          res.json(profile);
        }
        else {
          console.log("User not found: " + JSON.stringify(googleParams));
          res.status(404).send("User not found!");
          res.end();
        }
      }
    });
  }
}