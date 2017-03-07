var mongoose = require('mongoose');

var Schema = mongoose.Schema

if (!mongoose.connection.readyState == 0) {
  mongoose.connect('mongodb://localhost/integra')
}

// members have different access levels
var projectSchema = new Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String, required: true},
  logo: {type: String, required: false},
  email: {type: String, required: false},
  members: {type: [{_id: Schema.Types.ObjectId, level: Number}], default: []},
  frequencies: {type: [Schema.Types.ObjectId], default: []},
  requests: {type: [Schema.Types.ObjectId], default: []},
  events: {type: [Schema.Types.ObjectId], default: []}
});

module.exports = mongoose.model('Project', projectSchema);
