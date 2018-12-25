let mongoose = require('mongoose');

let PinSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    image: {
        type: String
    },
    utauloids: {
        type: [String]
    },
    points: {
        type: [String]
    },
    category: {
        type: String,
        required: true,
    }
});

let Pin = module.exports = mongoose.model('Pin', PinSchema);
