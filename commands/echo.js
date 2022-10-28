const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')),
    async execute(interaction, client) {
        const input = interaction.options.getString('input') ?? 'No input provided';
        interaction.reply(`${input}`);
    },
};