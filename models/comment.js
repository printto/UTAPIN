let mongoose = require('mongoose');

let CommentSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    points: {
        type: [String]
    }
});

let Comment = module.exports = mongoose.model('Comment', CommentSchema);
