const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const mongoose = require('mongoose');
const Citizen = require("../models/citizenSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Credits user'),
    async execute(interaction) {

        const { id } = interaction.user

        const citizen = await Citizen.findOne({ id })

        if (!citizen.workCooldown) {

            citizen.walletBalance += 500;
            citizen.workCooldown = true

            setTimeout(async () => {
                citizen.workCooldown = false
                await citizen.save()
            }, 1000 * 60 * 60)

            citizen.workAllowedAt = Date.now() + 1000 * 60 * 60;
            await citizen.save()

            const workEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${citizen.username}, you have been credited with 500!`)

            await interaction.reply({ embeds: [workEmbed] })
        } else {

            const remainingTime = citizen.workAllowedAt - Date.now()
            function millisToMinutesAndSeconds(millis) {
                var minutes = Math.floor(millis / 60000);
                var seconds = ((millis % 60000) / 1000).toFixed(0);
                return minutes + " minutes, " + (seconds < 10 ? '0' : '') + seconds + " seconds";
            }

            const cooldownEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${citizen.username}, you can work again in ${millisToMinutesAndSeconds(remainingTime)}`)

            await interaction.reply({ embeds: [cooldownEmbed] })
        }

    },
};