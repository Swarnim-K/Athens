const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    _id: String,
    username: String,
    avatarURL: String,
    polls: [String],
    countries: [
        {
            _id: String,
            name: String,
            roles: [
                {
                    _id: String,
                    dbName: String,
                    name: String,
                    starting: {
                        type: Number,
                        default: null
                    },
                    ending: {
                        type: Number,
                        default: null
                    },
                }
            ]
        }
    ]
});

const citizen = mongoose.model('Citizen', citizenSchema);

module.exports = citizen;