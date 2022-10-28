const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const Citizen = require("../models/citizenSchema")
const Poll = require("../models/pollSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a basic poll with two options')
        .addStringOption(option => option
            .setName('option1')
            .setDescription('First option of the poll')
            .setRequired(true))
        .addStringOption(option => option
            .setName('option2')
            .setDescription('Second option of the poll')
            .setRequired(true)),
    async execute(interaction) {

        const option1 = interaction.options.getString('option1')
        const option2 = interaction.options.getString('option2')

        const pollName = `${option1} VS ${option2}`
        const options = [
            {
                optionName: option1,
            },
            {
                optionName: option2
            }
        ]

        const poll = new Poll({ pollName, options })
        const pollData = await poll.save()

        const option1votes = pollData.options[0].votes
        const option2votes = pollData.options[1].votes

        const pollEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(pollName)
            .addFields(
                { name: option1, value: `${option1votes}`, inline: true },
                { name: option2, value: `${option2votes}`, inline: true }
            )

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${option1}`)
                    .setLabel(`${option1}`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`${option2}`)
                    .setLabel(`${option2}`)
                    .setStyle(ButtonStyle.Primary),
            );

        const sentPollEmbed = await interaction.reply({
            embeds: [pollEmbed],
            components: [buttons]
        });


        const collector = sentPollEmbed.createMessageComponentCollector({ componentType: ComponentType.Button, time: 1000 * 60 * 15 });

        collector.on('collect', async (i) => {

            const { id, username } = i.user

            const existingCitizen = await Citizen.findOne({ discordId: id })

            if (!existingCitizen) {
                i.reply({ content: `You don't exist on the database, run /work to get registered`, ephemeral: true });
                return;
            }

            const voter = await Citizen.find({ discordId: id })

            const targettedEmbedTitle = i.message.embeds[0].data.title
            const foundPoll = await Poll.find({ pollName: targettedEmbedTitle })

            const selectedOption = i.customId

            if (foundPoll[0].allVoters.includes(voter[0]._id)) {
                i.reply({ content: `You have already voted`, ephemeral: true });
                return;
            }

            for (let o = 0; o < foundPoll[0].options.length; o++) {
                if (foundPoll[0].options[o].optionName === selectedOption) {
                    foundPoll[0].options[o].votes += 1
                    foundPoll[0].options[o].voters.push(voter[0])
                    foundPoll[0].allVoters.push(voter[0])
                }
            }
            const updatedPollData = await foundPoll[0].save()

            const option1votes = updatedPollData.options[0].votes
            const option2votes = updatedPollData.options[1].votes


            const editedPollEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(pollName)
                .addFields(
                    { name: option1, value: `${option1votes}`, inline: true },
                    { name: option2, value: `${option2votes}`, inline: true }
                )

            await interaction.editReply({ embeds: [editedPollEmbed] })
            i.reply({ content: `You voted on the ${i.customId} option`, ephemeral: true });
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};