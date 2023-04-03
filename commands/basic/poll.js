const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const Country = require("../../models/countrySchema")
const Citizen = require("../../models/citizenSchema")
const Poll = require("../../models/pollSchema")

const slugify = require('slugify');

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

        const optionone = interaction.options.getString('option1')
        const optiontwo = interaction.options.getString('option2')

        const slug = slugify(`${optionone} vs ${optiontwo}`, { lower: true, strict: true });

        const author = await Citizen.findById(interaction.user.id)
        const country = await Country.findById(interaction.guild.id)

        const poll = new Poll({
            _id: interaction.id,
            name: slug,
            country: country,
            created: Date.now(),
            author: author,
            options: [
                {
                    name: optionone,
                    votes: 0,
                    voters: []
                },
                {
                    name: optiontwo,
                    votes: 0,
                    voters: []
                }
            ],
            voters: []
        })
        const polldata = await poll.save()


        const pollEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(polldata.name)
            .addFields(
                {
                    name: polldata.options[0].name,
                    value: `${polldata.options[0].votes}`,
                    inline: true
                },
                {
                    name: polldata.options[1].name,
                    value: `${polldata.options[1].votes}`,
                    inline: true
                }
            )

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${optionone}`)
                    .setLabel(`${optionone}`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`${optiontwo}`)
                    .setLabel(`${optiontwo}`)
                    .setStyle(ButtonStyle.Primary),
            );

        interaction.reply({
            embeds: [pollEmbed],
            components: [buttons]
        })
            .then(sentPollEmbed => {
                const collector = sentPollEmbed.createMessageComponentCollector({ componentType: ComponentType.Button, time: 1000 * 60 * 15 });

                collector.on('collect', async (interaction) => {

                    const voter = await Citizen.findById(interaction.user.id)
                    const poll = await Poll.findById(interaction.message.interaction.id)

                    const selectedOption = interaction.customId

                    const allVoters = []
                    for (let i = 0; i < poll.options.length; i++) {
                        for (let j = 0; j < poll.options[i].voters.length; j++) {
                            allVoters.push(poll.options[i].voters[j])
                        }
                    }

                    if (allVoters.includes(voter._id)) {
                        interaction.reply({ content: `You have already voted`, ephemeral: true });
                        return;
                    } else {
                        for (let o = 0; o < poll.options.length; o++) {
                            if (poll.options[o].name === selectedOption) {
                                poll.options[o].votes += 1
                                poll.options[o].voters.push(voter._id)
                                await poll.save()
                            }
                        }
                    }

                    const editedPollEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(poll.name)
                        .addFields(
                            {
                                name: poll.options[0].name,
                                value: `${poll.options[0].votes}`,
                                inline: true
                            },
                            {
                                name: poll.options[1].name,
                                value: `${poll.options[1].votes}`,
                                inline: true
                            }
                        )

                    await interaction.update({ embeds: [editedPollEmbed] })

                });
            })
    },
};