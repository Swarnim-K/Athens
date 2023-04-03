const Citizen = require("../models/citizenSchema");
const Country = require("../models/countrySchema");

const registerCitizen = async (interaction) => {
    // const { id, username } = interaction.user
    const user = interaction.user
    const existingCitizen = await Citizen.findById(user.id)
    if (!existingCitizen) {
        const citizen = new Citizen({
            _id: user.id,
            username: user.username,
            avatarURL: user.avatarURL(),
        });
        await citizen.save()
    }




}

module.exports = registerCitizen;