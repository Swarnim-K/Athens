const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ChannelType, PermissionsBitField } = require('discord.js');

const Country = require("../../models/countrySchema")
const Citizen = require("../../models/citizenSchema")
const Poll = require("../../models/pollSchema")

const slugify = require('slugify');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the country'),
    async execute(interaction) {
        const country = await Country.findById(interaction.guild.id)
        if (country.founded === true) {
            const alreadySetupEmbed = new EmbedBuilder()
                .setTitle("Country already setup")
                .setDescription("This country is already setup. If you want to reset the country, use /reset command.")
                .setColor("#00f5e4")
                .setThumbnail('https://static.vecteezy.com/system/resources/previews/014/692/680/non_2x/country-parliament-icon-simple-style-vector.jpg');

            await interaction.reply({ embeds: [alreadySetupEmbed], ephemeral: true });
            return;
        }

        const welcomeEmbed = new EmbedBuilder()
            .setTitle("Welcome to the Athens")
            .setDescription("_A simulation of democracy available on your discord server. This setup wizard will create all the necessary roles, channels and permissions._")
            .addFields(
                {
                    name: " ",
                    value: "\n"
                },
                {
                    name: " ",
                    value: "\n"
                },
                {
                    name: " ",
                    value: "Athens offers a range of exciting features to promote democratic decision-making and community involvement."
                },
                {
                    name: " ",
                    value: "Athens lets you hold fair elections to select your representatives in parliament, who'll be responsible for making changes, laws and policies for the country."
                },
                {
                    name: " ",
                    value: "Athens replace traditional needs of mods and staff who can be biased and irrational and creates democratically selected executive team to maintain decorum and order in the server."
                },
                {
                    name: " ",
                    value: "And still if citizens have any complaints or grievances, Athens creates judiciary team for listening to concerns of the members and ensure that democracy has been upheld."
                },
                {
                    name: " ",
                    value: "Click START and create your own thriving democratic community."
                }
            )
            .setFooter({
                text: "Click on Channels to read about the necessary channels that will be created.\nClick on roles read about the necessary roles that will be created\n"
            })
            .setColor("#00f5e4")
            .setThumbnail('https://static.vecteezy.com/system/resources/previews/014/692/680/non_2x/country-parliament-icon-simple-style-vector.jpg');

        const welcomeEmbedButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`channels`)
                    .setLabel(`Channels`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`roles`)
                    .setLabel(`Roles`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`elections`)
                    .setLabel(`Elections`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`start`)
                    .setLabel(`Start`)
                    .setStyle(ButtonStyle.Success),
            );


        const rolesEmbed = new EmbedBuilder()
            .setTitle("Welcome to the Athens")
            .setDescription("A simulation of democracy available on your discord server. This setup wizard will create all the necessary roles, channels and permissions.")
            .addFields(
                {
                    name: "Voters",
                    value: "Voters are the active citizens of the country. They can vote in elections and referendums.",
                },
                {
                    name: "Members of Parliament (MP)",
                    value: "Elected by the general public. Members of Parliament are the elected representatives of the people. They can vote in the parliament and propose bills.",
                },
                {
                    name: "Executive",
                    value: "Selected by Head-Voters, Executives are similar to moderators. They have the ability to mute and warn the members of the server. Yet, an executive cannot ban a member.",
                },
                {
                    name: "Legislative",
                    value: "Selected by Members of Parliament, the Judiciary ia responsible for resolving disputes. These includes complain against Head-Voters or Executive and banning or unbanning for a member.",
                },
            )
            .setFooter({
                text: "Click on Channels to read general overview about the necessary channels that will be created. Click on particular role name to read more about them. Click on Start to start the setup wizard."
            })
            .setColor("#00f5e4")
            .setThumbnail('https://static.vecteezy.com/system/resources/previews/014/692/680/non_2x/country-parliament-icon-simple-style-vector.jpg');

        const rolesButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`channels`)
                    .setLabel(`Channels`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`elections`)
                    .setLabel(`Elections`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`start`)
                    .setLabel(`Start`)
                    .setStyle(ButtonStyle.Success),
            );

        const channelsEmbed = new EmbedBuilder()
            .setTitle("Channels")
            .setDescription("The following channels will be created:")
            .addFields(
                {
                    name: "Parliament",
                    value: "Members of Parliament can discuss about the bills and referendums."
                },
                {
                    name: "General Election",
                    value: "General elections for selection of Member of Parliament will be held.",
                },
                {
                    name: "Bills",
                    value: "Members of Parliament can propose bills.",
                },
                {
                    name: "Constitution",
                    value: "This is the channel where the all rules and laws will presented here",
                },
                {
                    name: "Registry",
                    value: "All the changes in the country will be recorded here.",
                }
            )
            .setFooter({
                text: "Click on Roles to read general overview about the necessary roles that will be created. Click on particular channel name to read more about it. Click on Start to start the setup wizard."
            })
            .setColor("#00f5e4")
            .setThumbnail('https://static.vecteezy.com/system/resources/previews/014/692/680/non_2x/country-parliament-icon-simple-style-vector.jpg');


        const channelsButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`roles`)
                    .setLabel(`Roles`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`elections`)
                    .setLabel(`Elections`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`start`)
                    .setLabel(`Start`)
                    .setStyle(ButtonStyle.Success),
            );

        const setupEmbed = new EmbedBuilder()
            .setTitle("Setup Complete")
            .setDescription("All the necessary roles, channels and permissions have been created. You can now start the simulation.")
            .setFields(
                {
                    name: "General Election has been started",
                    value: " "
                }
            )
            .setColor("#00f5e4")
            .setThumbnail('https://static.vecteezy.com/system/resources/previews/014/692/680/non_2x/country-parliament-icon-simple-style-vector.jpg');


        interaction.reply({
            embeds: [welcomeEmbed],
            components: [welcomeEmbedButtons]
        })
            .then(sentPollEmbed => {
                const collector = sentPollEmbed.createMessageComponentCollector({ componentType: ComponentType.Button, time: 1000 * 60 * 60 });

                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'channels') {
                        await interaction.update({ embeds: [channelsEmbed], components: [channelsButtons] });
                    } else if (interaction.customId === 'roles') {
                        await interaction.update({ embeds: [rolesEmbed], components: [rolesButtons] });
                    } else if (interaction.customId === 'start' && country.founded === true) {
                        await interaction.update({ embeds: [alreadySetupEmbed], ephemeral: true });
                    }
                    else if (interaction.customId === 'start' && country.founded === false) {

                        //* Create a category of name Athens
                        await interaction.deferReply();


                        const parliamentChannel = await interaction.guild.channels.create({
                            name: "Parliament",
                            type: ChannelType.GuildText
                        });
                        country.attributes.parliament._id = parliamentChannel.id;
                        await parliamentChannel.permissionOverwrites.create(interaction.channel.guild.roles.everyone, { SendMessages: false });

                        const electionChannel = await interaction.guild.channels.create({
                            name: "Elections",
                            type: ChannelType.GuildText
                        });
                        country.attributes.elections._id = electionChannel.id;
                        await electionChannel.permissionOverwrites.create(interaction.channel.guild.roles.everyone, { SendMessages: false });

                        country.founded = true;
                        await country.save();
                        await interaction.editReply({ embeds: [setupEmbed] });

                        const election = require('./election');
                        election.execute(interaction);
                    }


                });

                collector.on('end', async collected => {
                    console.log(collected)
                });
            })
    },
};