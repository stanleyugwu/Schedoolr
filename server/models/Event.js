var mongoose = require('mongoose');
let validator = require('validator');

var Schema = mongoose.Schema;
const Events = new Schema({
    eventName: {type:String, required: true, min:1},
    startDate: { type: Number, required: true },
    duration: { type: Number, required: true },
    location: {type:String,required:true},
    description: {type:String,required:false},
    attendees:{type: Number, min:0, required: true},
    color: String,
    notified: Boolean,
    createdAt: { type: Number, required: true },
    notificationEmail: {type: String ,required: false}
});

module.exports = mongoose.model('Events', Events);
