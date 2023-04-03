const mongoose = require('mongoose');
const { Schema } = mongoose

const Citizen = require("../models/citizenSchema")

const pollSchema = new Schema({
    _id: String,
    name: String,
    created: Number,
    author: String,
    country: String,
    options: [
        {
            name: String,
            votes: {
                type: Number,
                default: 0
            },
            voters: [String]
        }
    ],
});

const poll = mongoose.model('Poll', pollSchema);

module.exports = poll;