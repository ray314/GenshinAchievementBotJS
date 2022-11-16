const { SlashCommandBuilder } = require('discord.js');
const { statsEmbed } = require('../embeds/statsEmbed');
const fetch = require('node-fetch');

// Get user data from python
const getUserData = async (uid) => {
	const response = await fetch("http://127.0.0.1:5000/userdata", {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(uid)
	}).catch(err => {
		console.error(err)
	}); 
	const data = await response.json();

	return data;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getuserinfo')
    .setDescription('Get Genshin player info')
    .addIntegerOption(option => option
      .setName('input')
      .setDescription('Your Genshin UID')
      .setRequired(true)),
    
  async execute(interaction) {
    const UID = interaction.options.getInteger('input');
    //interaction
		await getUserData(UID).then(data => {
			interaction.reply(`${ { embeds: [statsEmbed.add(data)] } }`)
		}); 
  },
};