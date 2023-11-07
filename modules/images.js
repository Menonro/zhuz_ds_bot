import fetch from 'node-fetch'
import sfw from './data/actions.json' assert  { type: "json" }
import newReactions from './data/reactions2.json' assert  { type: "json" }
import kawai from './data/kawai.json' assert  { type: "json" }

const nsfw = [ 'neko', 'waifu', 'trap', 'blowjob' ]

export async function commands () {
    return [
        {
            name: 'time',
            description: 'Получить время некоторых участников сервера',
        },
    ]
};
// sfw.forEach(el => commands.push({
//     name: el[0],
//     description: el[1],
//     options: [
//         {
//             name: 'user',
//             description: 'С кем?',
//             required: false,
//             type: 6
//         }
//     ]
// }))
// nsfw.forEach(el => commands.push({
//     name: 'nsfw' + el,
//     description: 'контент)'
// }))

export async function interactive(interaction) {
    if (sfw.map(el=>el[0]).includes(interaction.commandName)) {
        const command = sfw.find(el=>el[0] === interaction.commandName)
        const resp = await fetch(`https://api.waifu.pics/sfw/${interaction.commandName}`)
        const data = await resp.json()
        const target = interaction.options.get('user')
        if (target) {
            await interaction.reply(`<@${interaction.user.id}> ${command[1]} <@${target.value}>`);
            await interaction.channel.send(data.url);
        } else {
            await interaction.reply(data.url);
        }
    }
    if (nsfw.map(el=>'nsfw' + el).includes(interaction.commandName)) {
        if (interaction.channelId !== '1083719045582438430') {
            return await interaction.reply({
                ephemeral: true,
                embeds: [
                    {
                        "type": "rich",
                        "title": `NSFW`,
                        "description": "Тут нельзя, используй <#1083719045582438430>)",
                        "color": 0x00FFFF,
                    }
                ]
            });
        }
        const command = nsfw.find(el=>('nsfw' + el) === interaction.commandName)
        const resp = await fetch(`https://api.waifu.pics/nsfw/${command}`)
        const data = await resp.json()
    
        await interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    "type": "rich",
                    "title": `NSFW`,
                    "description": "Специально для тебя",
                    "color": 0x00FFFF,
                    "image": {
                        "url": data.url,
                    },
                    "url": data.url
                }
            ]
        });
    }
}

export async function messages(msg) {
    if (msg.content[0] === '!') {
        if (sfw.map(el=>el[0]).includes(msg.content.substr(1))) {
            const command = sfw.find(el=>el[0] === msg.content.substr(1))
            const resp = await fetch(`https://api.waifu.pics/sfw/${msg.content.substr(1)}`)
            const data = await resp.json()
            if (msg.mentions.repliedUser) {
                await msg.channel.send(`<@${msg.author.id}> ${command[1]} <@${msg.mentions.repliedUser.id}>`);
            }
            await msg.channel.send(data.url);
        }
    }
    if (msg.content[0] === '.') {
        if (newReactions.includes(msg.content.substr(1))) {
          const command = newReactions.find(el=>el === msg.content.substr(1))
    
          const resp = await fetch(`https://api.otakugifs.xyz/gif?reaction=${command}&format=gif`)
          const data = await resp.json()
          if (msg.mentions.repliedUser) {
            return await msg.channel.send({
                embeds: [
                    {
                        "type": "rich",
                        "title": command,
                        "description": `<@${msg.mentions.repliedUser.id}>`,
                        "color": 0x00FFFF,
                        "image": {
                            "url": data.url,
                        },
                        "url": data.url
                    }
                ]
            });
            } else {
                return await msg.channel.send({
                    embeds: [
                        {
                            "type": "rich",
                            "title": command,
                            "description": `<@${msg.author.id}>`,
                            "color": 0x00FFFF,
                            "image": {
                                "url": data.url,
                            },
                            "url": data.url
                        }
                    ]
                });
            }
        }
    }
    if (msg.content[0] === '?') {
        if (kawai.includes(msg.content.substr(1))) {
          const command = kawai.find(el=>el === msg.content.substr(1))
     
          const resp = await fetch(`https://kawaii.red/api/gif/${command}/token=${process.env.KAWAI_TOKEN}/`)
          const data = await resp.json()
          if (msg.mentions.repliedUser) {
            return await msg.channel.send({
                embeds: [
                    {
                        "type": "rich",
                        "title": command,
                        "description": `<@${msg.mentions.repliedUser.id}>`,
                        "color": 0x00FFFF,
                        "image": {
                            "url": data.response,
                        },
                        "url": data.response
                    }
                ]
            });
          } else {
            return await msg.channel.send({
                embeds: [
                    {
                        "type": "rich",
                        "title": command,
                        "description": `<@${msg.author.id}>`,
                        "color": 0x00FFFF,
                        "image": {
                            "url": data.response,
                        },
                        "url": data.response
                    }
                ]
            });
          }
        }
    }
    if (msg.content === '.smoke' || msg.content === '!smoke') {
        const gifs = [
            'https://tenor.com/view/cyber-punk-smoking-cigarette-lucy-gif-26732854',
            'https://tenor.com/view/drug-anime-girl-gif-26426197',
            'https://tenor.com/view/smoke-anime-cowboy-bebop-gif-15630140',
            'https://tenor.com/view/90s-anime-gif-23509308',
            'https://tenor.com/view/aki-csm-chainsaw-man-anime-denji-gif-21889758',
            'https://tenor.com/view/anime-smoking-blink-gif-11970008',
            'https://tenor.com/view/smoke-gif-19326831',
            'https://tenor.com/view/brook-one-piece-gif-21124293',
            'https://tenor.com/view/shoto-todoroki-todoroki-boku-no-hero-academia-smoke-anime-gif-24653124',
            'https://tenor.com/view/sekaiichi-hatsukoi-anime-smoke-chilling-relax-gif-17239405',
            'https://tenor.com/view/one-piece-black-leg-sanji-vinsmoke-sanji-smoking-windy-gif-16533315',
            'https://tenor.com/view/sanji-one-piece-sanji-vinsmoke-gif-11985950',
            'https://tenor.com/view/sanji-smoking-cool-one-piece-vinsmoke-sanji-gif-22211898',
        ]
        await msg.channel.send(gifs[Math.floor(Math.random()*gifs.length)]);
    }
}