let mongoose = require('mongoose');

let UtauSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    short_description: {
        type: String
    },
    gender: {
        type: String
    },
    range: {
        type: String
    },
    related: {
        type: [String]
    },
    age: {
        type: Number
    },
    genre: {
        type: String
    },
    homepage: {
        type: String
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    chara_item: {
        type: String
    },
    creator: {
        type: String
    },
    voicer: {
        type: String
    },
    media_list: {
        type: [String]
    },
    birthday: {
        type: Date
    },
    like: {
        type: String
    },
    dislike: {
        type: String
    },
    release: {
        type: Date
    },
    flags: {
        type: String
    },
    personality: {
        type: String
    },
    voicebank: {
        type: [String]
    },
    image: {
        type: String
    },
    other: {
        type: String
    },
    year_ranked_points: {
        type: Number,
        default: 0
    },
    month_ranked_points: {
        type: Number,
        default: 0
    },
    week_ranked_points: {
        type: Number,
        default: 0
    },
    points: {
        type: [String]
    },
    pin_points: {
        type: Number,
        default: 0
    },
    comments: {
        type: [String]
    },
    rewards: {
        type: [String]
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    cssAndScript: {
        type: String
    }
});

let Utau = module.exports = mongoose.model('Utau', UtauSchema);
