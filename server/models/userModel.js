const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
const userSchema = mongoose.Schema({
    name: {type: String,required: true},
    password: {type: String, trim: true},
    email: { type: String, required: true},
    pic: {
        type: String,
        default: ''
    }
}, {timestamps: true})

userSchema.pre('save', async function(next) {
    if(!this.isModified) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema)

module.exports = User;