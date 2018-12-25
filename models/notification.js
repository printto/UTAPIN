let mongoose = require('mongoose');

let NotificationSchema = mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date
    },
    read: {
        type: Boolean
    }
});

let Notification = module.exports = mongoose.model('Notification', NotificationSchema);
