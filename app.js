require('dotenv').config()


// Require the necessary discord.js classes
const fs = require('fs');
const path = require('path');
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const token = process.env.DISCORD_TOKEN
const { REST, Routes } = require('discord.js');
const clientId = process.env.DISCORD_CLIENT_ID;

// Connecting to database
require("./db")

// Register slash commands
require("./deploy-commands")


// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(commandsPath)
commandFolder.forEach(folder => {
    const commandFiles = fs.readdirSync(`${commandsPath}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, folder, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
});



const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}



// Log in to Discord with your client's token
client.login(token);



