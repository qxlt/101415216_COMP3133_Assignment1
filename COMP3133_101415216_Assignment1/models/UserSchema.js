const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String, unique: true}
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema);

module.exports = User