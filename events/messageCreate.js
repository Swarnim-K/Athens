const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');

const mongoose = require('mongoose');
const Country = require("../models/countrySchema")
const Citizen = require("../models/citizenSchema")

const registerCitizen = require("../utilities/registerCitizen");
const registerCountry = require("../utilities/registerCountry");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        // console.log(message.content)
    },
};