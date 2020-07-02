var mongoose = require('mongoose');
let validator = require('validator');

var Schema = mongoose.Schema;
const Expired = new Schema({
    eventName: { type: String, required: true },
    startDate: { type: Number, required: true },
    duration: { type: Number, required: true },
    location: { type: Schema.Types.Mixed, required: true },
    description: { type: Schema.Types.Mixed, required: false },
    attendees: { type: Number, min: 0, required: true },
    color: String,
    notified: Boolean,
    createdAt: { type: Number, required: true },
    notificationEmail: { type: Schema.Types.Mixed, required: false },
});

module.exports = mongoose.model('Expired', Expired);
