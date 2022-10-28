const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const mongoose = require('mongoose');
const Citizen = require("../models/citizenSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposits money from wallet to bank')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('The amount to deposit')),
    async execute(interaction) {

        const { id } = interaction.user

        const citizen = await Citizen.findOne({ id })

        const amount = Number(interaction.options.getString('amount') ?? citizen.walletBalance);

        const depositEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${citizen.username}'s balance`)

        if (amount > citizen.walletBalance) {
            depositEmbed
                .addFields(
                    { name: 'Wallet', value: `${citizen.walletBalance}`, inline: true },
                    { name: 'Bank', value: `${citizen.bankBalance}`, inline: true },
                )
                .setFooter({ text: `You don't have the specific amount in your wallet` })

            await interaction.reply({ embeds: [depositEmbed] })
            return;
        } else if (amount < 0) {
            depositEmbed
                .addFields(
                    { name: 'Wallet', value: `${citizen.walletBalance}`, inline: true },
                    { name: 'Bank', value: `${citizen.bankBalance}`, inline: true },
                )
                .setFooter({ text: `You can't deposit negative value` })

            await interaction.reply({ embeds: [depositEmbed] })
            return;
        }

        citizen.bankBalance += amount
        citizen.walletBalance -= amount;
        await citizen.save()

        depositEmbed
            .addFields(
                { name: 'Wallet', value: `${citizen.walletBalance}`, inline: true },
                { name: 'Bank', value: `${citizen.bankBalance}`, inline: true },
            )

        if (amount != 0) {
            depositEmbed
                .setAuthor({ name: `${amount} has been deposited to your bank` })
        }

        await interaction.reply({ embeds: [depositEmbed] })

    },
};