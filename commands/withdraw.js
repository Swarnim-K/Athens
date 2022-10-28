const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const mongoose = require('mongoose');
const Citizen = require("../models/citizenSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraws money from bank to wallet')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('The amount to withdraw')),
    async execute(interaction) {

        const { id } = interaction.user

        const citizen = await Citizen.findOne({ id })

        const amount = Number(interaction.options.getString('amount') ?? citizen.bankBalance);

        const withdrawEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${citizen.username}'s balance`)

        if (amount > citizen.bankBalance) {
            withdrawEmbed
                .addFields(
                    { name: 'Wallet', value: `${citizen.walletBalance}`, inline: true },
                    { name: 'Bank', value: `${citizen.bankBalance}`, inline: true },
                )
                .setFooter({ text: `You don't have the specific amount in your bank` })

            await interaction.reply({ embeds: [depositEmbed] })
            return;
        } else if (amount < 0) {
            withdrawEmbed
                .addFields(
                    { name: 'Wallet', value: `${citizen.walletBalance}`, inline: true },
                    { name: 'Bank', value: `${citizen.bankBalance}`, inline: true },
                )
                .setFooter({ text: `You can't deposit negative value` })

            await interaction.reply({ embeds: [depositEmbed] })
            return;
        }

        citizen.walletBalance += amount;
        citizen.bankBalance -= amount
        await citizen.save()

        withdrawEmbed
            .addFields(
                { name: 'Wallet', value: `${citizen.walletBalance}`, inline: true },
                { name: 'Bank', value: `${citizen.bankBalance}`, inline: true },
            )

        if (amount != 0) {
            withdrawEmbed
                .setAuthor({ name: `${amount} has been deposited from your wallet` })
        }

        await interaction.reply({ embeds: [withdrawEmbed] })

    },
};