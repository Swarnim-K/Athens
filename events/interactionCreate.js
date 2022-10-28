const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');

const mongoose = require('mongoose');
const Citizen = require("../models/citizenSchema")

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        // Adding citizen
        const { id, username } = interaction.user

        const existingCitizen = await Citizen.findOne({ discordId: id })

        if (!existingCitizen) {
            const citizen = new Citizen({ discordId: id, username });
            await citizen.save()
        }

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