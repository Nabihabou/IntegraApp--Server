var mongoose = require('mongoose')

var Schema = mongoose.Schema

if (!mongoose.connection.readyState == 0) {
  mongoose.connect('mongodb://localhost/integra')
}

var eventSchema = new Schema({
  author: {type: Schema.Types.ObjectId, required: true},
  project: {type: Schema.Types.ObjectId, required: true},
  projectName: {type:String, required: true},
  place: {type: String, required: true},
  title: {type: String, required: true},
  description: String,
  startsAt: {type: Date, required: true},
  duration: {type: Number, required: true}
});

module.exports = mongoose.model('Event', eventSchema)
