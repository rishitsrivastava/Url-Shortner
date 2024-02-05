const mongoose = require("mongoose");
const { Mongodb_url } = require("./url");
mongoose.connect(Mongodb_url);

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true,
        minLength: 3,
        maxLenghth: 40
    },
    password : {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLenghth : 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}