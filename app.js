require('dotenv').config();
const { Intents, Client } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
//const client = new Discord.Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});

client.login(process.env.TOKEN);