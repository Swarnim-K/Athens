const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const mongoose = require('mongoose');
const Citizen = require("../models/citizenSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows the balance of the citizen')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User whose balance to show')),
    async execute(interaction) {
        const { id } = interaction.options.getUser('user') || interaction.user
        const citizen = await Citizen.findOne({ id })

        const balanceEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${citizen.username}'s balance`)
            .addFields(
                { name: 'Wallet', value: `${citizen.walletBalance}`, inline: true },
                { name: 'Bank', value: `${citizen.bankBalance}`, inline: true },
            )

        await interaction.reply({ embeds: [balanceEmbed] })

    },
};