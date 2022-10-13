require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const fetch = require('node-fetch');

const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1N6Bo0oG22b0wsf_OtCuGjtJJw3r5Iy-U2YDz72BJtGU');

const { ActivityType, Client, EmbedBuilder, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })
const pagination = require('./embedpages.js');
const statsEmbed = require('./statsEmbed.js');


var rankingWorldMsgRef;
var rankingEUMsgRef;
var rankingNAMsgRef;
var rankingAsiaMsgRef;

// Channels
/*const GLBChannel = client.channels.cache.get('932174810858008586');
const EUChannel = client.channels.cache.get('932173948999843870');
const NAChannel = client.channels.cache.get('932173907694354492');
const AsiaChannel = client.channels.cache.get('932173991710441472');*/

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({
		activities: [{ name: 'WHEEZETAO', type: ActivityType.Listening }],
		status: 'Listening',
	})
	startUp();
});

// Check if the bot is logged in, relog if it's not
const checkLoggedIn = async () => {
	if (!client.isReady()) {
		console.log("Bot not logged in, relogging...");
		await client.login(process.env.TOKEN).then(async () => {
			console.log("Loading Google service account...");
			await doc.useServiceAccountAuth({
				// Use env variables
				client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
				private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
			});
			console.log("Loading spreadsheet...");
			await doc.loadInfo(); // Load spreadsheet
			console.log(doc.title); // Print title
		});

	}
}

// Load the service account
const loadServiceAccount = async () => {
	console.log("Loading Google service account...");
	await doc.useServiceAccountAuth({
		// Use env variables
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
	});
	console.log("Loading spreadsheet...");
	await doc.loadInfo(); // Load spreadsheet
	console.log(doc.title); // Print title
}

// Start up the service account and live update
const startUp = async () => {
	await loadServiceAccount().then(() => {
		// Live update start
		console.log("Starting live update...");
		setInterval(updateRankings, 60000 * 60);
		setInterval(checkLoggedIn, 60000 * 180); // Check whether the bot is logged in
		console.log("Done");
	});
};


const rankingsEmbed = async (title, region, limit) => {

	try {
		// Load sheet
		const sheet = doc.sheetsByTitle[region];
		await sheet.loadHeaderRow(2);
		const rows = await sheet.getRows({ offset: 0, limit: 10 });
		const rankingList = rows;
		//console.log("Rows loaded");
		// Embeds the ranking message
		const rankingsEmbed = new EmbedBuilder()
			.setColor('#FFBB5C')
			.setTitle(`Top ${limit} ${title} Achievements Rankings`)
			.setURL('https://docs.google.com/spreadsheets/d/1Wa10jrAqu6hTdV8HJJf6jFKpLRjYht1xeBbsS0SDRUU/htmlview#')
			.setThumbnail('https://cdn.discordapp.com/attachments/364202581938929674/935324914964119642/icon.png')
		for (let i = 0; i < limit && i < rankingList.length; i++) {
			// _rawData[1] = Name, _rawData[2] = Score
			//console.log(`#${i + 1}: ${rankingList[i]._rawData[1]} :trophy: ${rankingList[i]._rawData[3]}`)
			rankingsEmbed.addFields({ name: `#${i + 1}: ${rankingList[i]._rawData[1]}`, value: ` :trophy: ${rankingList[i]._rawData[3]}` })
		}
		rankingsEmbed.addFields({ name: 'Spreadsheet:', value: 'https://docs.google.com/spreadsheets/d/1N6Bo0oG22b0wsf_OtCuGjtJJw3r5Iy-U2YDz72BJtGU/htmlview#' })
			.setTimestamp()
		return rankingsEmbed
	} catch (error) {
		console.error("Error trying to get rankings for " + region);
		console.error(error);
		return;
	}

}

const getRankings = async (region) => {
	const sheet = doc.sheetsByTitle[region];
	await sheet.loadHeaderRow(2);
	const rows = await sheet.getRows({ offset: 0 });
	return rows;
}

// Update rankings in rankings channel
const updateRankings = async () => {
	// Global
	if (rankingWorldMsgRef !== undefined) {
		const rankings = await rankingsEmbed('Global', 'World Rank', 10);
		if (rankings != undefined) {
			rankingWorldMsgRef.edit({ embeds: [rankings] });
		}

	}
	// EU
	if (rankingEUMsgRef !== undefined) {
		const rankings = await rankingsEmbed('EU', 'EU Rank', 5);
		if (rankings != undefined) {
			rankingEUMsgRef.edit({ embeds: [rankings] });
		}

	}
	// NA
	if (rankingNAMsgRef !== undefined) {
		const rankings = await rankingsEmbed('NA', 'NA Rank', 5);
		if (rankings != undefined) {
			rankingNAMsgRef.edit({ embeds: [rankings] });
		}

	}
	// Asia
	if (rankingAsiaMsgRef) {
		const rankings = await rankingsEmbed('Asia', 'Asia Rank', 5);
		if (rankings != undefined) {
			rankingAsiaMsgRef.edit({ embeds: [rankings] });
		}

	}
}

// Receive messages from user
client.on("messageCreate", async message => {
	const msg = message.content.toLowerCase();
	// Check if member is not null
	if (message.member !== null) {
		const GLBChannel = client.channels.cache.get('932174810858008586');
		const EUChannel = client.channels.cache.get('932173948999843870');
		const NAChannel = client.channels.cache.get('932173907694354492');
		const AsiaChannel = client.channels.cache.get('932173991710441472');

		const rankingsWorld = await rankingsEmbed('Global', 'World Rank', 10);
		const rankingsEU = await rankingsEmbed('EU', 'EU Rank', 5)
		const rankingsNA = await rankingsEmbed('NA', 'NA Rank', 5)
		const rankingsAsia = await rankingsEmbed('Asia', 'Asia Rank', 5)

		const roles = message.member.roles.cache.has('925164302082662460') || message.member.roles.cache.has('925163038712135700') || message.member.roles.cache.has('925160493709131826');
		// Embed message
		if (msg === ".rankings") {
			const rankRegions = [rankingsWorld, rankingsEU, rankingsNA, rankingsAsia];
			pagination.run(client, message, rankRegions);
			// Live
		} if (msg.startsWith('.say') && roles) {
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
			//await postAllRankings();
			await clearChannels(GLBChannel, EUChannel, NAChannel, AsiaChannel).then(() => {
				console.log("Sending rankings");
				GLBChannel.send({ embeds: [rankingsWorld] })
					.then(msg => rankingWorldMsgRef = msg);
				EUChannel.send({ embeds: [rankingsEU] })
					.then(msg => rankingEUMsgRef = msg);
				NAChannel.send({ embeds: [rankingsNA] })
					.then(msg => rankingNAMsgRef = msg);
				AsiaChannel.send({ embeds: [rankingsAsia] })
					.then(msg => rankingAsiaMsgRef = msg);
			}); // Clear all channels before sending in the embeds for the rankings

		}

	}

	// Get user data via UID
	if (msg.startsWith('.playerinfo')) {
		const UID = message.content.slice(11).trim();
		await getUserData(UID).then(data => {
			message.channel.send({ embeds: [statsEmbed.add(data)] })
		});
	}
})

const clearChannels = async (GLBChannel, EUChannel, NAChannel, AsiaChannel) => {
	await Promise.all([
		GLBChannel.bulkDelete(5),
		EUChannel.bulkDelete(5),
		NAChannel.bulkDelete(5),
		AsiaChannel.bulkDelete(5)
	]).then(console.log("Deleted all messages"));
	/*await GLBChannel.bulkDelete(5)
		.then(messages => console.log(`GLB Bulk deleted ${messages.size} messages`))
		.catch(console.error);
	await EUChannel.bulkDelete(5)
		.then(messages => console.log(`EU Bulk deleted ${messages.size} messages`))
		.catch(console.error);
	await NAChannel.bulkDelete(5)
		.then(messages => console.log(`NA Bulk deleted ${messages.size} messages`))
		.catch(console.error);
	await AsiaChannel.bulkDelete(5)
		.then(messages => console.log(`Asia Bulk deleted ${messages.size} messages`))
		.catch(console.error);*/
};

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

client.on('error', error => {
	console.log("Discord Error:" + error);
});

client.login(process.env.TOKEN);

app.get('/', (req, res) => {
	res.send('WHEEZEEZEZEZEEZ')
})

app.get('/getrankings', async (req, res) => {
	try {
		// GLB Rank
		let rows = await getRankings('World Rank');
		const rankingList = { GLB: [], NA: [], EU: [], Asia: [] };
		for (i = 0; i < rows.length; i++) {
			rankingList.GLB.push(rows[i]._rawData)
		}
		// NA Rank
		rows = await getRankings('NA Rank');
		for (i = 0; i < rows.length; i++) {
			rankingList.NA.push(rows[i]._rawData)
		}
		// EU Rank
		rows = await getRankings('EU Rank');
		for (i = 0; i < rows.length; i++) {
			rankingList.EU.push(rows[i]._rawData)
		}
		// Asia Rank
		rows = await getRankings('Asia Rank');
		for (i = 0; i < rows.length; i++) {
			rankingList.Asia.push(rows[i]._rawData)
		}
		const json = JSON.stringify(rankingList);

		//res.set('Access-Control-Allow-Origin', 'http://34.125.207.132:3080')
		res.set('Access-Control-Allow-Origin', '*')
		res.send(json)
	} catch (error) {

		console.error(error);
	}

})

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})