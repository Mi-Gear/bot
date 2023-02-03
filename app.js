const Discord = require("discord.js")
const {GatewayIntentBits, Partials } = require('discord.js');
const config = require("./config.json")
const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });
const fs = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const {EmbedBuilder} = require('discord.js');
class Player
{
  constructor(name)
  {
    this.name = name;
  }
  hp = 50;
  gold = 250;
  inventory = []
}
client.on('messageCreate',message =>
{
  if (message.author.bot || !message.content.startsWith(config.prefix))
  return;
  const args = message.content.slice(config.prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();
  const author = message.author
  const authorid = author.id
  const channel = message.channel
  switch(cmd)
  {
    //Команда help
    case 'help':
      {
        message.channel.send("Это меню помощи. Здесь пока пусто")
      }
    break
    //Команда start для создания персонажа юзера
    case 'start':
      {
        var file = JSON.parse(fs.readFileSync(config.players,'utf-8'))
        let exist = playerExist(authorid);
        if(args[0] == null && exist == -1)
        {

          message.channel.send("Синктаксис команды: [ "+config.prefix+"start [Имя вашего персонажа] ]")
        }
        else
        if(exist == -1 || file.length == 0 && args[0] != null)
        {
          file.push({"id":message.author.id,"player": new Player(args[0])})
          let newplayers = JSON.stringify(file)
          fs.writeFileSync(config.players,newplayers)
          message.channel.send("Ваш персонаж создан!")
        }
        if(exist>=0)
        {
          message.channel.send("Вы уже создали своего персонажа, хватит!")
        }
      }
    break
    //Вывод пользователю профиля
    case 'profile':
      var file = JSON.parse(fs.readFileSync(config.players,'utf-8'))
      let num = playerExist(authorid)
      if(num!= -1)
      {
        let p = file[num].player
        sendEmbedPlayerProfile(p,channel)
      }
    break
    default:
      message.channel.send("Нет такой команды дурак")
      break

  }
  

function sendEmbedPlayerProfile(p,channel)
{
  const Info = 
  {
    color:0xFFBF00,
    title:"Профиль игрока "+p.name,
    fields:[{name: 'hp',value: p.hp,inline: true}, {name:'gold', value:p.gold,inline: true},],
  }
  const Row = new ActionRowBuilder()
  .addComponents(new ButtonBuilder()
  .setCustomId('inventory')
  .setLabel('Inventory')
  .setStyle(ButtonStyle.Success))
  channel.send({embeds:[Info],components:[Row]})
}
})

function playerExist(id)
  {
    var file = JSON.parse(fs.readFileSync(config.players,'utf-8'))
    for(let i = 0; i < file.length;i++)
    {
      if(id == file[i].id)
      {
        return i
      }
    }
    return -1
  }
client.once(Events.ClientReady, function(){console.log("Всё работает, папаша")})

client.on('interactionCreate',interaction => {
  if(!interaction.isButton())return;
  switch(interaction.customId)
  {
    case 'inventory':
      var file = JSON.parse(fs.readFileSync(config.players,'utf-8'))
      console.log()
      let num = playerExist(interaction.user.id)
      if(num != -1)
      {
        let arr = file[num].player.inventory
        if(arr.lenght >= 0)
        interaction.reply(arr)
        else
        interaction.reply("Какой инвентарь, ты бомж ебать")
        
      }
    break
  }
})
client.login(config.token)
