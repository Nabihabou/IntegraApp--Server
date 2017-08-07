var mongoose = require('mongoose')

var Schema = mongoose.Schema

if (!mongoose.connection.readyState == 0) {
  mongoose.connect('mongodb://localhost/integra')
}
// The reason why google_id is not _id is because a Profile can exist before a
// google_id is assigned to it, in this case google_id = "" along with all fields except email
var profileSchema = new Schema({
  google_id: {type:String, default: ""},
  google_picture: {type: String, default: ""},
  google_name: {type: String, default: ""},
  google_email: {type: String, required: true, unique: true},
  is_admin: {type: Boolean, default: false},
  course: {type: String, default: ""},
  shirt_size: {type: String, enum: ["PP", "P", "M", "G", "GG"], default: "M"},
  begin_course: {type: Date, default: Date.now},
  end_course: {type: Date, default: Date.now},
  gender: {type: String, enum:["Masculino", "Feminino", ""], default: ""},
  telephone: {type: Number, default: null},
  cellphone: {type: Number, default: null},
  cpf: {type: Number, default: null},
  rg: {type: Number, default: null},
  cep: {type: String, default: null},
  address: {type: String, default: null},
  city: {type: String, default: null},
  birthday: {type: Date, default: Date.now},
  projects: {type: [Schema.Types.ObjectId], default: []},
  frequencies: {type: [Schema.Types.ObjectId], default: []}
})

module.exports = mongoose.model('Profile', profileSchema)
