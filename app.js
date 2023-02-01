const Discord = require("discord.js")
const {GatewayIntentBits, Partials } = require('discord.js');
const config = require("./config.json")
const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

client.on('messageCreate',message =>
{
  if (message.author.bot || !message.content.startsWith(config.prefix))
  return;
  const args = message.content.slice(config.prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();
  switch(cmd)
  {
    case 'help': message.channel.send("Это меню помощи. Здесь пока пусто")
    break;
  }


})





client.on('ready', function(){console.log("Всё работает, папаша")})
client.login(config.token)
