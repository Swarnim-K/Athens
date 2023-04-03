const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const moment = require('moment');

const Country = require("../../models/countrySchema")
const Election = require("../../models/electionSchema")
const Citizen = require("../../models/citizenSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('election')
        .setDescription('Starts a general election or give information about the ongoing election'),
    async execute(interaction) {

        const country = await Country.findById(interaction.guild.id)
        if (!country || country.founded == false) {
            return interaction.reply({ content: "Your country has not been set up yet, please run /setup", ephemeral: true })
        }

        //* Election duration in milliseconds
        const electionDuration = country.attributes.electionDuration

        channel = interaction.guild.channels.cache.get(country.attributes.elections._id)

        //* Getting a latest election id from the elections arrays in the country model and finding the election by the id
        const latestElection = await Election.findById(country.elections[country.elections.length - 1])

        //! THE MAIN PART OF THE COMMAND

        if (!latestElection || latestElection.startedAt + latestElection.duration < Date.now()) {



            const electionEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${country.name} - General Election ${moment(Date.now()).format('MMMM YYYY')}`)
                .setFooter(
                    {
                        text: `Election ends on: ${moment(Date.now() + electionDuration).format('MMMM Do YYYY, h:mm:ss a')}`,
                    })

            const electionButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('run')
                        .setLabel('Run For Candidancy')
                        .setStyle(ButtonStyle.Success)
                )

            await channel.send({
                embeds: [electionEmbed],
                components: [electionButton],
            }).then(async runForCandidatePoll => {

                //* Setting the election id as the message id of the election start message
                const election = new Election({
                    _id: runForCandidatePoll.id,
                    country: country._id,
                    startedAt: Date.now(),
                    duration: electionDuration,
                })
                await election.save()
                country.elections.push(`${election._id}`)
                await country.save()

                //* Creating message collector on the election start message
                //* When collector is triggered, it will send the candidate election poll embed
                const collector = runForCandidatePoll.createMessageComponentCollector({ componentType: ComponentType.Button, time: electionDuration });

                collector.on('collect', async (runForElectionInteraction) => {

                    const existingCandidate = election.candidates.find(candidate => candidate._id === runForElectionInteraction.user.id)


                    channel = runForElectionInteraction.guild.channels.cache.get(country.attributes.elections._id)

                    if (!election || election.startedAt + election.duration < Date.now()) {
                        return runForElectionInteraction.reply({ content: "There is no ongoing election", ephemeral: true })
                    }

                    else if (existingCandidate) {
                        return runForElectionInteraction.reply({ content: "You are already a candidate", ephemeral: true })
                    }

                    else if (election.startedAt + election.duration > Date.now()) {

                        const collectingTime = election.startedAt + election.duration - Date.now()

                        election.candidates.push({
                            _id: runForElectionInteraction.user.id,
                        })
                        await election.save()
                        candidate = election.candidates.find(candidate => candidate._id === runForElectionInteraction.user.id)

                        const candidateEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(`General Election ${moment(election.startedAt).format('MMMM YYYY')} Candidate`)
                            .setFields(
                                {
                                    name: 'Name:',
                                    value: `<@${runForElectionInteraction.user.id}>`,
                                    inline: true,
                                },
                            )
                            .setFooter({
                                text: `Election ends on: ${moment(election.startedAt + election.duration).format('MMMM Do YYYY, h:mm:ss a')}`,
                            })

                            .setThumbnail(runForElectionInteraction.user.avatarURL())

                        const candidateButtons = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('approve')
                                    .setLabel('Approve')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('reject')
                                    .setLabel('Reject')
                                    .setStyle(ButtonStyle.Danger),
                            )


                        //* Sends the candidate election poll embed and creates a collector on the embed
                        //* This collector will collect the votes from the voters on a specific candidate
                        await runForElectionInteraction.deferReply({ ephemeral: true })

                        await channel.send({
                            embeds: [candidateEmbed],
                            components: [candidateButtons],
                        }).then(poll => {
                            const pollCollector = poll.createMessageComponentCollector({ componentType: ComponentType.Button, time: collectingTime });

                            pollCollector.on('collect', async (voteForCandidateInteraction) => {

                                //* If there are two or more candidates, the candidate election poll embed have the same id
                                //* Meaning voting on any of the embed will trigger the voting on the last candidate
                                //! Hence we get the voted candidate id from the embed fields
                                const votedCandidateId = voteForCandidateInteraction.message.embeds[0].fields[0].value.slice(2, -1)
                                const votedCandidate = election.candidates.find(candidate => candidate._id === votedCandidateId)

                                const allVoters = votedCandidate.votes.approved.voters.concat(votedCandidate.votes.rejected.voters)

                                if (voteForCandidateInteraction.user.id === votedCandidateId) {
                                    voteForCandidateInteraction.reply({ content: "While it is certainly important to have confidence in oneself, it is crucial to maintain the integrity of the democratic process by refraining from engaging in any actions that may be perceived as self-serving. It is generally considered inappropriate for a candidate to vote for themselves in an election, as it may be perceived as an attempt to manipulate the outcome of the election in their own favor", ephemeral: true })
                                }

                                else if (allVoters.includes(voteForCandidateInteraction.user.id)) {
                                    voteForCandidateInteraction.reply({ content: "You have already voted", ephemeral: true })
                                }

                                else if (voteForCandidateInteraction.customId === 'approve') {
                                    votedCandidate.votes.approved.voters.push(voteForCandidateInteraction.user.id)
                                    votedCandidate.votes.approved.count++
                                    await election.save()
                                    voteForCandidateInteraction.reply({ content: `You have voted for <@${votedCandidateId}>`, ephemeral: true })
                                }

                                else if (voteForCandidateInteraction.customId === 'reject') {
                                    votedCandidate.votes.rejected.voters.push(voteForCandidateInteraction.user.id)
                                    votedCandidate.votes.rejected.count++
                                    await election.save()
                                    voteForCandidateInteraction.reply({ content: `You have voted against <@${votedCandidateId}>`, ephemeral: true })
                                }
                            });
                        })
                    }
                });

            })
        }

        //! END OF MAIN SECTION

        //* If there is an election and it has not ended, give information about the ongoing election
        else if (latestElection.startedAt + latestElection.duration > Date.now()) {
            const fields = []
            for (let i = 0; i < latestElection.candidates.length; i++) {
                fields.push({
                    name: ` `,
                    value: `${i + 1}.<@${latestElection.candidates[i]._id}>`,
                    inline: true,
                })
            }
            const electionEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${country.name} - General Election ${moment(latestElection.startedAt).format('MMMM YYYY')}`)
                .setDescription(`**Candidates**`)
                .addFields(fields)
                .setFooter(
                    {
                        text: `Election ends on: ${moment(latestElection.startedAt + latestElection.duration).format('MMMM Do YYYY, h:mm:ss a')}`,
                    })
            await interaction.reply({
                embeds: [electionEmbed],
            })


        }

        setTimeout(async () => {
            const election = await Election.findById(country.elections[country.elections.length - 1])

            const resultEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${country.name} - General Election ${moment(election.startedAt).format('MMMM YYYY')} - Results`)
            channel.send({
                embeds: [resultEmbed],
            })

            election.candidates.forEach(async candidate => {
                const citizen = await Citizen.findById(candidate._id)
                const approvedVotes = candidate.votes.approved.count
                const rejectedVotes = candidate.votes.rejected.count
                let result = ""
                if (approvedVotes > rejectedVotes) {
                    result = `**${citizen.username}** has won the election with ${approvedVotes} votes!`
                } else if (approvedVotes < rejectedVotes) {
                    result = `**${citizen.username}** has lost the election`
                } else {
                    result = `**${citizen.username}** has tied the election`
                }

                const candidateResultEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`${citizen.username}`)
                    .setThumbnail(citizen.avatarURL)
                    .setDescription(`*${result}*`)
                    .addFields(
                        {
                            name: "Approval Votes",
                            value: `${approvedVotes}`,
                            inline: true,
                        },
                        {
                            name: "Rejection Votes",
                            value: `${rejectedVotes}`,
                            inline: true,
                        }
                    )
                await channel.send({
                    embeds: [candidateResultEmbed],
                })
            })
        }, electionDuration)



    },
};