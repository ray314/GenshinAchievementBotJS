require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1N6Bo0oG22b0wsf_OtCuGjtJJw3r5Iy-U2YDz72BJtGU');

const { Intents, Client, MessageEmbed, MessageButton, MessageActionRow, Message } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const pagination = require('./embedpages.js');


var rankingWorldMsgRef;
var rankingEUMsgRef;
var rankingNAMsgRef;
var rankingAsiaMsgRef;

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`)
	client.user.setActivity('WHEEZETAO', { type: 'LISTENING' });
});


(async function () {
	console.log("Loading account...");
	await doc.useServiceAccountAuth({
		// Use env variables
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
	});
	console.log("Loading info...");
	await doc.loadInfo(); // Load spreadsheet
	console.log(doc.title); // Print title

	// Live update start
	console.log("Starting live update...");
	setInterval(updateRankings, 60000 * 10);
	console.log("Done")
}());


const rankingsEmbed = async(title, region, limit) => {
	// Load sheet
	// NA RANK
	const sheet = doc.sheetsByTitle[region];
	await sheet.loadHeaderRow(2);
	const rows = await sheet.getRows({ offset: 1, limit: 10 });
	const rankingList = rows;
	//console.log("Rows loaded");
	// Embeds the ranking message
	const rankingsEmbed = new MessageEmbed()
		.setColor('#FFBB5C')
		.setTitle(`Top ${limit} ${title} Achievements Rankings`)
		.setURL('https://docs.google.com/spreadsheets/d/1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU/htmlview#')
		.setThumbnail('https://cdn.discordapp.com/attachments/364202581938929674/935324914964119642/icon.png')
	for (let i = 0; i < limit && i < rankingList.length; i++) {
		// _rawData[1] = Name, _rawData[2] = Score
		rankingsEmbed.addField(`#${i + 1}: ${rankingList[i]._rawData[1]}`, `:trophy: ${rankingList[i]._rawData[3]}`)
	}
	rankingsEmbed.addField('Spreadsheet:', 'https://docs.google.com/spreadsheets/d/1N6Bo0oG22b0wsf_OtCuGjtJJw3r5Iy-U2YDz72BJtGU/htmlview#', true)
		.setTimestamp()
	return rankingsEmbed;
}

// Update rankings in rankings channel
const updateRankings = async () => {
	// Global
	if (rankingWorldMsgRef !== undefined) {
		const rankings = await rankingsEmbed('Global', 'World Rank', 10);
		rankingWorldMsgRef.edit({ embeds: [rankings] });
	}
	// EU
	if (rankingEUMsgRef !== undefined) {
		const rankings = await rankingsEmbed('EU', 'EU Rank', 5);
		rankingEUMsgRef.edit({ embeds: [rankings] });
	}
	// NA
	if (rankingNAMsgRef !== undefined) {
		const rankings = await rankingsEmbed('NA', 'NA Rank', 5);
		rankingNAMsgRef.edit({ embeds: [rankings] });
	}
	// Asia
	if (rankingAsiaMsgRef) {
		const rankings = await rankingsEmbed('Asia', 'Asia Rank', 5);
		rankingAsiaMsgRef.edit({ embeds: [rankings] });
	}
}

// Receive messages from user
client.on("message", async message => {
	const msg = message.content.toLowerCase();
	// Check if member is not null
	if (message.member !== null) {
		// Channels
		const GLBChannel = client.channels.cache.get('932174810858008586');
		const EUChannel = client.channels.cache.get('932173948999843870');
		const NAChannel = client.channels.cache.get('932173907694354492');
		const AsiaChannel = client.channels.cache.get('932173991710441472');

		const rankingsWorld = await rankingsEmbed('Global', 'World Rank', 10);
		const rankingsEU = await rankingsEmbed('EU', 'EU Rank', 5)
		const rankingsNA = await rankingsEmbed('NA', 'NA Rank', 5)
		const rankingsAsia = await rankingsEmbed('Asia', 'Asia Rank', 5)
		const roles = message.member.roles.cache.has('925164302082662460') || message.member.roles.cache.has('925163038712135700');
		// Embed message
		if (msg === ".rankings") {
			const rankRegions = [rankingsWorld, rankingsEU, rankingsNA, rankingsAsia];
			pagination.run(client, message, rankRegions);
			// Live
		} if (msg.startsWith('.say')) {
			if (message.author.bot) return;
			// Get the channel mention
			if (message.mentions.channels.size == 0) {
				const SayMessage = message.content.slice(4).trim();
				message.channel.send(SayMessage);
			}
			else {
				let targetChannel = message.mentions.channels.first();
				// Get the message to print

				const args = message.content.split(" ").slice(2);
				let saytext = args.join(" ");
				targetChannel.send(saytext);
			}
		} else if (msg === ".rankingglblive" && roles) {
			//const rankingsWorld = await rankingsEmbed('Global', 'World Rank', 10);
			rankingWorldMsgRef = await message.channel.send({ embeds: [rankingsWorld] });
			// EU
		} else if (msg === ".rankingeulive" && roles) {
			//const rankingsEU = await rankingsEmbed('EU', 'EU Rank', 5);
			rankingEUMsgRef = await message.channel.send({ embeds: [rankingsEU] });
			// NA
		} else if (msg === ".rankingnalive" && roles) {
			//const rankingsNA = await rankingsEmbed('NA', 'NA Rank', 5);
			rankingNAMsgRef = await message.channel.send({ embeds: [rankingsNA] });
			// Asia
		} else if (msg === ".rankingasialive" && roles) {
			//const rankingsAsia = await rankingsEmbed('Asia', 'Asia Rank', 5);
			rankingAsiaMsgRef = await message.channel.send({ embeds: [rankingsAsia] });
		} else if (msg == ".postallrankings" && roles) {
			GLBChannel.send({ embeds: [rankingsWorld] })
				.then(msg => rankingWorldMsgRef = msg);
			EUChannel.send({ embeds: [rankingsEU] })
				.then(msg => rankingEUMsgRef = msg);
			NAChannel.send({ embeds: [rankingsNA] })
				.then(msg => rankingNAMsgRef = msg);
			AsiaChannel.send({ embeds: [rankingsAsia] })
				.then(msg => rankingAsiaMsgRef = msg);
        }

    }
	
})

client.login(process.env.TOKEN);

app.get('/', (req, res) => {
    res.send('WHEEZEEZEZEZEEZ')
})

app.get('/updateRankings', (req, res) => {
	//setInterval(updateRankings, 10000);
	res.send('Updated')
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})