const mongoose = require("mongoose");
const { Mongodb_url } = require("./mongourl");
mongoose.connect(Mongodb_url)
    .then(() => console.log('Connected to mongodb'))
    .catch(err => console.error('error connecting to mongodb', err));

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

const urlSchema = new mongoose.Schema({
    longurl: {
        type: String,
        required: true,
    },
    shorturl: {
        type: String,
        required: true
    },
    shortID: {
        type: String,
        required: true
    },
    numberOfClicks: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);
const URL = mongoose.model('URL', urlSchema);

module.exports = {
    User,
    URL
}