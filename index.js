require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU');
const creds = require('./genshinachievements-3c51d828779a')

const { Intents, Client, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })


client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`)
	client.user.setActivity('WHEEZETAO', { type: 'LISTENING' });

	(async function () {
		console.log("Loading account...");
		//await doc.useServiceAccountAuth(creds, 'hu-tao@genshinachievements.iam.gserviceaccount.com');
		await doc.useServiceAccountAuth({
			// Use env variables
			client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
		});
		console.log("Loading info...");
		await doc.loadInfo(); // Load spreadsheet
		console.log(doc.title); // Print title

		// NA RANK
		const sheet = doc.sheetsByIndex[4];
		//await sheet.loadCells();
		await sheet.loadHeaderRow(2);
		//const cell = sheet.getCellByA1('B4');
		//const cells = await sheet.loadCells('A1:E10');
		const rows = await sheet.getRows({ offset: 1, limit: 10 });
		console.log(rows);
	}());
});

var rankingList;

const rankingsEmbed = new MessageEmbed()
	.setColor('#FFBB5C')
	.setTitle('Top 10 Global Achievements Rankings')
	.setURL('https://docs.google.com/spreadsheets/d/1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU/htmlview#')
	.setThumbnail('https://cdn.discordapp.com/attachments/364202581938929674/935324914964119642/icon.png')
	.addFields(
		{ name: '#1: tuna', value: ':trophy: 570' },
		{ name: '#2: Gura', value: ':trophy: 569' },
		{ name: '#3: Thorwyn', value: ':trophy: 569' },
		{ name: '#4: Thorwyn', value: ':trophy: 569' },
		{ name: '#5: Thorwyn', value: ':trophy: 569' },
		{ name: '#6: Thorwyn', value: ':trophy: 569' },
		{ name: '#7: Thorwyn', value: ':trophy: 569' },
		{ name: '#8: Thorwyn', value: ':trophy: 569' },
		{ name: '#9: Thorwyn', value: ':trophy: 569' },
		{ name: '#10: Thorwyn', value: ':trophy: 569' },
	)
	.addField('Spreadsheet', 'https://docs.google.com/spreadsheets/d/1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU/htmlview#', true)
	.setTimestamp()

const rankingsText = `
Top 10 Global Achievements Rankings
#1: tuna
?? 570
#2: Gura
?? 569
#3: Thorwyn
?? 569
#4: klem
?? 568
#5: riot
?? 567
#6: TM2
?? 566
#7: Frisk
?? 565
#8: Chici
?? 565
#9: Nando'Guns
?? 564
#10: Shadow
?? 563
Spreadsheet:
https://docs.google.com/spreadsheets/d/1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU/htmlview#`;

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'rankings') {
		await interaction.reply({ embeds: [rankingsEmbed] });
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});



client.login(process.env.TOKEN);

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})