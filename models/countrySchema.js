const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    _id: String,
    name: String,
    attributes: {
        electionDuration: {
            type: Number,
            default: 86400000
        },
        parliament: {
            _id: String,
            name: {
                type: String,
                default: "Parliament"
            },
        },
        elections: {
            _id: String,
            name: {
                type: String,
                default: "Elections"
            }
        },
        voters: {
            _id: String,
            name: {
                type: String,
                default: "Voters"
            }
        },
        membersofparliament: {
            _id: String,
            name: {
                type: String,
                default: "Members of Parliament"
            },
        },
        executives: {
            _id: String,
            name: {
                type: String,
                default: "Executives"
            },
        },
        judiaciary: {
            _id: String,
            name: {
                type: String,
                default: "Judiaciary"
            },
        },
        chancellor: {
            _id: String,
            name: {
                type: String,
                default: "Chancellor"
            },
        }
    },
    founded: {
        type: Boolean,
        default: false
    },
    elections: [String],
});

const country = mongoose.model('Country', countrySchema);

module.exports = country;