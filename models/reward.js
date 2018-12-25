let mongoose = require('mongoose');

let RewardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    }
});

let Reward = module.exports = mongoose.model('Reward', RewardSchema);
