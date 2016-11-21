var mongoose = require('mongoose')

var Schema = mongoose.Schema

if (!mongoose.connection.readyState == 0) {
  mongoose.connect('mongodb://localhost/integra')
}

var eventSchema = new Schema({
  author: {type: Schema.Types.ObjectId, required: true},
  project: {type: Schema.Types.ObjectId, required: true},
  title: {type: String, required: true, unique: true},
  description: String,
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true}
});

module.exports = mongoose.model('Event', eventSchema)
