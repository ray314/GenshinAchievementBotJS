require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU');
const creds = require('./genshinachievements-3c51d828779a');

const { Intents, Client, MessageEmbed, MessageButton, MessageActionRow, Message } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const pagination = require('./embedpages.js');

//const disbutpages = require('./embedpages.js');


var rankingList = [];
client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`)
	client.user.setActivity('WHEEZETAO', { type: 'LISTENING' });
	const channel = client.channels.cache.get('925162552730730506');
	/*const embeds = [];
	embeds.push(new MessageEmbed()
		.setTitle("EU Rankings")
		.setColor("YELLOW"));
	embeds.push(new MessageEmbed()
		.setTitle("Asia Rankings")
		.setColor("GREEN"));
	
	embeds.push(new MessageEmbed()
		.setTitle("NA Rankings")
		.setColor("BLUE"));
	
	var pages = [embeds[0], embeds[1], embeds[2]];
	pagesEmbed(client, channel, pages, 1000, "RED");*/
	//pagination.run(client, channel, null);
});


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
	/*
	// NA RANK
	const sheet = doc.sheetsByIndex[4];
	//await sheet.loadCells();
	await sheet.loadHeaderRow(2);
	//const cell = sheet.getCellByA1('B4');
	//const cells = await sheet.loadCells('A1:E10');
	const rows = await sheet.getRows({ offset: 1, limit: 10 });
	rankingList = rows;
	console.log("Rows loaded");*/
}());


const rankingsEmbed = async() => {
	// Load sheet
	// NA RANK
	const sheet = doc.sheetsByTitle['World'];
	//await sheet.loadCells();
	await sheet.loadHeaderRow(2);
	//const cell = sheet.getCellByA1('B4');
	//const cells = await sheet.loadCells('A1:E10');
	const rows = await sheet.getRows({ offset: 1, limit: 10 });
	rankingList = rows;
	console.log("Rows loaded");
	// Embeds the ranking message
	const rankingsEmbed = new MessageEmbed()
		.setColor('#FFBB5C')
		.setTitle('Top 10 Global Achievements Rankings')
		.setURL('https://docs.google.com/spreadsheets/d/1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU/htmlview#')
		.setThumbnail('https://cdn.discordapp.com/attachments/364202581938929674/935324914964119642/icon.png')
	/*.addFields(
		{ name: `#1: ${rankingList[0]._rawData[1]}`, value: `:trophy: ${rankingList[0]._rawData[2]}` },
		{ name: `#2: ${rankingList[1]._rawData[1]}`, value: `:trophy: ${rankingList[1]._rawData[2]}` },
		{ name: `#3: ${rankingList[2]._rawData[1]}`, value: `:trophy: ${rankingList[2]._rawData[2]}` },
		{ name: `#4: ${rankingList[3]._rawData[1]}`, value: `:trophy: ${rankingList[3]._rawData[2]}` },
		{ name: `#5: ${rankingList[4]._rawData[1]}`, value: `:trophy: ${rankingList[4]._rawData[2]}` },
		{ name: `#6: ${rankingList[5]._rawData[1]}`, value: `:trophy: ${rankingList[5]._rawData[2]}` },
		{ name: `#7: ${rankingList[6]._rawData[1]}`, value: `:trophy: ${rankingList[6]._rawData[2]}` },
		{ name: `#8: ${rankingList[7]._rawData[1]}`, value: `:trophy: ${rankingList[7]._rawData[2]}` },
		{ name: `#9: ${rankingList[8]._rawData[1]}`, value: `:trophy: ${rankingList[8]._rawData[2]}` },
		{ name: `#10: ${rankingList[9]._rawData[1]}`, value: `:trophy: ${rankingList[9]._rawData[2]}` },*/

	for (let i = 0; i < 10; i++) {
		// _rawData[1] = Name, _rawData[2] = Score
		rankingsEmbed.addField(`#${i + 1}: ${rankingList[i]._rawData[1]}`, `:trophy: ${rankingList[i]._rawData[2]}`)
	}
	rankingsEmbed.addField('Spreadsheet:', 'https://docs.google.com/spreadsheets/d/1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU/htmlview#', true)
		.setTimestamp()
	return rankingsEmbed;
}

// Update rankings in rankings channel
const updateRankings = () => {

}
// Post rankings in rankings channel
const postRankings = () => {

}

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'rankings') {
		await interaction.reply({ embeds: [await rankingsEmbed()] });
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});

client.on("message", async message => {
	if (message.content === ".rankings") {
		const rankRegions = [await rankingsEmbed()];
		pagination.run(client, message, rankRegions);
    }
})

client.login(process.env.TOKEN);

app.get('/', (req, res) => {
    res.send('WHEEZEEZEZEZEEZ')
})

app.get('/updateRankings', (req, res) => {
	updateRankings();
	res.send('Updated')
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})