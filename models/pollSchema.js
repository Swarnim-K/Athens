const mongoose = require('mongoose');
const { Schema } = mongoose

const pollSchema = new Schema({
    pollId: String,
    pollName: String,
    creationTime: String,
    options: [
        {
            optionName: String,
            votes: {
                type: Number,
                default: 0
            },
            voters: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Citizen"
                }
            ]
        }
    ],
    allVoters: [
        {
            type: Schema.Types.ObjectId,
            ref: "Citizen"
        }
    ]
});

const poll = mongoose.model('Poll', pollSchema);

module.exports = poll;