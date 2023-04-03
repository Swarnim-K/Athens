
const findCitizen = async (interaction) => {
    const Country = require("../models/countrySchema");
    const user = interaction.user
    const guild = interaction.guild

    const foundCountry = await Country.findById(guild.id)

    for (let i = 0; i < foundCountry.members.length; i++) {
        if (foundCountry.members[i]._id === user.id) {
            return foundCountry.members[i]
        }
    }
}

module.exports = findCitizen;