const Country = require('../models/countrySchema')
const Citizen = require('../models/citizenSchema')

const registerCountry = async (interaction) => {
    const { guild } = interaction
    const existingCountry = await Country.findById(guild.id)
    if (!existingCountry) {
        const country = new Country({ _id: guild.id, name: guild.name });
        await country.save()
    }
}

module.exports = registerCountry;