const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: [true, 'Please enter an email'], validate: [isEmail, 'Please enter a valid email'], },
    password: { type: String, required: [true, 'Please enter a password'] },
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})
module.exports = mongoose.model('User', userSchema);