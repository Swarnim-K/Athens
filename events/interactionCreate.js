const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');

const mongoose = require('mongoose');
const Country = require("../models/countrySchema")
const Citizen = require("../models/citizenSchema")

const registerCitizen = require("../utilities/registerCitizen");
const registerCountry = require("../utilities/registerCountry");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        const { guild } = interaction

        await registerCountry(interaction);
        await registerCitizen(interaction);

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};