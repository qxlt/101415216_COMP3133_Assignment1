const mongoose = require('mongoose')

const empSchema = mongoose.Schema({
    first_name : {type: String, required: true},
    last_name : {type: String, required: true},
    email: {type: String, unique: true},
    gender: {type: String },
    designation: {type: String, required: true},
    salary: {type: Number, required: true, length: 1000},
    date_of_joining: {type: Date, required: true},
    department: {type: String, required: true},
    employee_photo: {type: String, default: ""}
    },
    { timestamps: true }
)
const Emp = mongoose.model('Emp', empSchema);

module.exports = Emp