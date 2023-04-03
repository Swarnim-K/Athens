const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    _id: String,
    country: String,
    startedAt: Number,
    duration: Number,
    candidates: [{
        _id: String,
        result: {
            type: String,
            default: "Not yet announced",
        },
        votes: {
            approved: {
                count: {
                    type: Number,
                    default: 0
                },
                voters: [String],
            },
            rejected: {
                count: {
                    type: Number,
                    default: 0
                },
                voters: [String],
            }
        },
    }],
});

const election = mongoose.model('Elections', electionSchema);

module.exports = election;