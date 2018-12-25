let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    utau: {
        type: [String]
    },
    website: {
        type: String
    },
    profile: {
        type: String
    },
    posts: {
        type: [String]
    },
    rewards: {
        type: [String]
    },
    points: {
        type: [String]
    },
    comments: {
        type: [String]
    },
    isAdmin: {
        type: Boolean
    },
    isBanned: {
        type: Boolean
    }
});

let User = module.exports = mongoose.model('User', UserSchema);
