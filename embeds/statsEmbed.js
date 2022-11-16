const { EmbedBuilder } = require("discord.js");

module.exports = {
  add: (data) => {
    try {
      const statsEmbed = new EmbedBuilder()
        .setColor('#FFBB5C')
        .setTitle(`${data.info.nickname}`)
        .setThumbnail('https://cdn.discordapp.com/attachments/1034811282953601025/1042391722296086608/746288052388888588.webp')
      statsEmbed.addFields({ name: 'Achievements: ', value: `${data.stats.achievements}`});
      statsEmbed.addFields({ name: 'Adventure Rank: ', value: `${data.info.level}`});
      statsEmbed.addFields({ name: 'Characters: ', value: `${data.stats.characters}`});
      statsEmbed.addFields({ name: 'Server: ', value: `${data.info.server}`});

      statsEmbed.addFields({ name: 'Common chests: ', value: `${data.stats.common_chests}`});
      statsEmbed.addFields({ name: 'Exquisite chests: ', value: `${data.stats.exquisite_chests}`});
      statsEmbed.addFields({ name: 'Precious chests: ', value: `${data.stats.precious_chests}`});
      statsEmbed.addFields({ name: 'Luxurious chests: ', value: `${data.stats.luxurious_chests}`});
      
      return statsEmbed
    } catch (error) {
      console.error("Error trying to get player data");
      console.error(error);
      return;
      }
    
  }
}