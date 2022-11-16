require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const { ActivityType, Client, EmbedBuilder, GatewayIntentBits, Collection, Events } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Loop over the files and set up the commands
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({
		activities: [{ name: 'WHEEZETAO', type: ActivityType.Listening }],
		status: 'Listening',
	})
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found`);
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    await interaction.reply({ content: 'There was an error while executing this command!' + error, ephemeral: true });
  }
})

client.login(process.env.TOKEN);

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})