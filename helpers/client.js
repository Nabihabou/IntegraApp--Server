module.exports = {
  findOne: function(req, res, objectName) {
    return function(err, object) {
      if(err) {
        res.status(500).send("Something went wrong: " + err);
        res.end();
      }
      else {
        if (object) {
          console.log("Sent " + objectName + " data: " + JSON.stringify(object));
          res.json(object);
        }
        else {
          console.log(objectName+ " not found");
          console.log(req.query);
          console.log(req.body);
          res.status(404).send(objectName+ " not found!");
          res.end();
        }
      }
    }
  },
  findAll: function(req, res, objectName) {
    return function(err, objs) {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      } else {
        console.log("Returning " + objectName + "s");
        res.json(objs);
      }
    }
  },
  count: function(req, res, objectName) {
    return function(err, count) {
      if (err) {
        console.log("Something went wrong with " + objectName + ": " + err);
        res.status(500).send("Something went wrong with " + objectName + ": " + err);
        res.end();
      } else {
        res.json({
          count: count
        });
      }
    }
  }
}