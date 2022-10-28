const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    discordId: String,
    username: String,
    walletBalance: {
        type: Number,
        default: 0
    },
    bankBalance: {
        type: Number,
        default: 0
    },
    workCooldown: {
        type: Boolean,
        default: false
    },
    workAllowedAt: {
        type: Date,
    }
});

const citizen = mongoose.model('Citizen', citizenSchema);

module.exports = citizen;