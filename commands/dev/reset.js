const { SlashCommandBuilder } = require('discord.js');

const Country = require("../../models/countrySchema")
const Election = require("../../models/electionSchema")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Resets the country'),
    async execute(interaction) {

        await interaction.channel.bulkDelete(100)

        const country = await Country.findById(interaction.guild.id)
        const channels = country.channels

        await interaction.deferReply()

        // const electionChannel = country.attributes.elections._id
        const electionChannel = interaction.guild.channels.cache.get(country.attributes.elections._id)
        electionChannel.delete()

        const parliamentChannel = interaction.guild.channels.cache.get(country.attributes.parliament._id)
        parliamentChannel.delete()

        // Deletes all the elections which are in the country.elections array
        await Election.deleteMany({ _id: { $in: country.elections } })

        await Country.deleteOne({ _id: interaction.guild.id })

        await interaction.editReply({ content: "Country has been reset", ephemeral: true })

    },
};