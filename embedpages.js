const { Message, MessageEmbed } = require('discord.js');
const { pagination } = require('reconlx');

// Constants


module.exports = {
    name: "",

    run: async (client, message, embeds) => {
        pagination({
            embeds: embeds,
            time: 30000,
            channel: message.channel,
            author: message.author,
            pageTravel: true,
            fastSkip: true
        });
    }
}