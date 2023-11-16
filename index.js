import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';

import { filter, getWhitelist } from './whitelist.js'

import { commands as commandsImages, interactive as interactiveImages, messages as messagesImages } from './modules/images.js'
import { interactive as interactiveTime, messages as messagesTime } from './modules/time.js'
import { messages as messagesAutoReplyes } from './modules/autoreply.js'
import { messages as messagesPatPat } from './modules/patpat.js'
import { messages as messagesGPT } from './modules/gpt.js'
import { commands as commandsSD, interactive as interactiveSD, messages as messagesSD } from './modules/sd.js'
import { messages as messagesTimer } from './modules/timer.js'
import { messages as messagesHelp } from './modules/help.js'
import { messages as messagesSpeach } from './modules/speech.js'

import dotenv from 'dotenv'

dotenv.config()

Object.prototype.isset = function (path = '') {
    if (path === '') {
        return true;
    }
    let keys = path.split('.');
    return typeof this[keys[0]] === 'undefined' || this[keys[0]] === null ? false : this[keys[0]].isset(keys.slice(1).join('.'));
};

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// BOT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.on('ready', async () => {
    console.log(`Авторизован под ботом ${client.user.tag}!`);
    await getCommands()
    // await helloMessage()
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (getWhitelist().whitelist.servers.TL != interaction.guild.id + '') {
        await interactiveTime(interaction)
        await interactiveImages(interaction)
        await interactiveSD(interaction)

        if (interaction.commandName === 'reload_commands') {
            getCommands()
            await interaction.reply({
                content: 'Готово',
                components: [],
            })
        }
    } else {
        await interactiveSD(interaction)
    }
});

client.on('messageCreate', async msg => {
    if (msg.author.bot) return;
    const info = filter(msg);
    if (!info[0]) return;

    await messagesSpeach(msg)
    await messagesImages(msg)
    await messagesAutoReplyes(msg)
    await messagesTimer(msg)
    await messagesPatPat(msg)
    if (getWhitelist().whitelist.servers.TL != msg.guild.id + '') {
        await messagesGPT(msg)
        await messagesTime(msg)
        await messagesHelp(msg)
        await messagesSD(msg, client)
    } else {
        // console.log(msg);
        if (msg.channel.id == process.env.TL_CHANNEL) {
            await messagesSD(msg, client)
        }
    }
});

client.login(process.env.TOKEN);
  

async function helloMessage(channelID, message) {
    const channel = await client.channels.fetch(channelID)
    channel.send({
        embeds: [
            {
            "type": "rich",
            "title": `**${(new Date).toLocaleDateString()}**`,
            "description": message,
            "color": 0x00FFFF,
            }
        ]
    });
}

async function getCommands() {
    try {
        const commands = await Promise.all([
            commandsImages(),
            commandsSD(),
        ])
        await rest.put(Routes.applicationCommands(process.env.APP_ID), {
            body: [...commands.flat(), {
                name: 'reload_commands',
                description: 'Перезагрузить список команд',
            }]
        });
        console.log('Setted /commands');
    } catch (error) {
        console.error(error);
    }
}