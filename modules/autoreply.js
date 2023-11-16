import fetch from 'node-fetch'
import bad from './data/bad.json' assert { type: 'json' }
import nice from './data/nice.json' assert { type: 'json' }

const reg = /<@\d{3,}>/gi

export async function messages(msg) {
    if (msg.content.length > 6) {
        if (countUpper(msg.content)) {
            if (msg.author.id === process.env.VITA) {
                await msg.reply('Мам, тише <a:blinkblink:1082923203988574279>')
            }
        }
    }
    // if (msg.content.match(/!msg/i)) {
    //     if (msg.author.id === '') {
    //         const channel = await client.channels.fetch('')
    //         channel.send(msg.content.substring(5));
    //     }
    // }
    if (msg.content.match(/контор/i)) {
        await msg.reply('<:kontora:1039856569019531264>');
    }
    if (msg.content.includes(':kontora:')) {
        await msg.reply('<:kontora:1039856569019531264>');
    }
    if (msg.content.match(/к ноге/i) || msg.content.match(/пездюк/gi)) {
        if (msg.author.id === process.env.MENONRO) {
            await msg.reply('Да мой господин 🧑‍🦽');
        } else if (msg.author.id === process.env.VITA) {
            await msg.reply('Да моя госпожа 🧑‍🦽');
        } else if (msg.author.id === process.env.GRIB) {
            await msg.reply('🍄');
        } else {
            await msg.reply('<:kekw_angry:1083404569217871943>');
        }
    }
    if (msg.content.match(/чо думаешь о/gi)) {
        const IDs = Array.from(msg.content.matchAll(reg))
        if (IDs.length > 0) {
            const finalIDs = IDs.filter(el => !el[0].includes(process.env.APP_ID))
            const answer = finalIDs.map(user => user + ' ' + nice[Math.floor(Math.random()*nice.length)])
            await msg.reply('Я думаю, что: ' + answer.join(', '));
        }
    }
    if (msg.content.match(/что думаешь о/gi)) {
        const IDs = Array.from(msg.content.matchAll(reg))
        if (IDs.length > 0) {
            const finalIDs = IDs.filter(el => !el[0].includes(process.env.APP_ID))
            const answer = finalIDs.map(user => user + ' ' + bad[Math.floor(Math.random()*bad.length)])
            await msg.reply('Я думаю, что: ' + answer.join(', '));
        }
    }
    // ----------------
    if (msg.content.match(/шио /gi) || msg.content.match(/ шио/gi) || msg.content.toLowerCase() === 'шио') {
        await msg.reply('https://tenor.com/view/spit-funny-frowning-grumpy-gif-14501018');
    }
    if (msg.content.match(/кто нахуй/gi)) {
        await msg.reply('Я нахуЭ! <a:dehyanedamazhit:1082672524887859200>');
    }
    if (msg.content.match(/ты пездюк/gi)) {
        await msg.reply('я пездюк');
    }
    if (msg.content.match(/1000-7/gi)) {
        await msg.reply('Сам такой <:pepe_FeelsGood:1082669759402885140>');
    }
    // if (msg.content.match(/убивать/gi)) {
    //     await msg.reply('https://tenor.com/view/%D0%BA%D0%B8%D0%B1%D0%BE%D1%80%D0%B3-%D1%83%D0%B1%D0%B8%D0%B9%D1%86%D0%B0-%D0%BA%D1%80%D1%83%D1%82%D0%B8%D0%BB%D0%BA%D0%B0-%D1%87%D0%B5%D0%BB-%D0%BA%D1%80%D1%83%D1%82%D0%B8%D1%82%D1%8C%D1%81%D1%8F-gif-21817806');
    // }
    if (msg.content.match(/вайфайч/gi)) {
        await msg.reply('Вайфайчик хороший <:raiden_yae:1082695837278273637>');
    }
    if (msg.content.match(/выключи бот/gi)) {
        await msg.reply('Нинада меня выключать <:kekw_ISTERIKA:1082668518216048791>');
    }
    if (msg.content.match(/<:you_gay:1114856820264149014>/gi)) {
        await msg.reply('<:noyou_gay:1114860104949448714>');
    }
    if (msg.content.match(/сам гей/gi)) {
        await msg.reply('https://media.discordapp.net/attachments/987305087783301130/1113577280887857163/image_15-PhotoRoom.png-PhotoRoom.png');
    } else if (msg.content.match(/гей /gi) || msg.content == 'гей') {
        await msg.reply('https://media.discordapp.net/attachments/987305087783301130/1113577280636211210/yaegay.png');
    }
    if (msg.content.match(/бот /gi) || msg.content.match(/ бот/gi)) {
        if (msg.author.id == process.env.KELVIC) {
            await msg.reply('Что я опять сделал <:kekw_ISTERIKA:1082668518216048791>');
        }
    }
    if (msg.content.match(/увековечить депр/gi)) {
        await msg.channel.send('https://cdn.discordapp.com/attachments/1083355824841314334/1083495805018714203/deprSt.png');
    }
    // if (msg.content.match(/испан/gi)) {
    //     await msg.channel.send('https://cdn.discordapp.com/attachments/987305087783301130/1083874148973031434/KEKW.mp4');
    // } 
    if (msg.content.match(/бонк/gi) || msg.content.match(/боньк/gi)) {
        await msg.reply('https://media.discordapp.net/attachments/956642009618214912/1012817689779122226/GIF-220614_093147.gif');
    }
    // if (msg.content.match(/cum/gi) || msg.content.match(/semen/gi)) {
    //     await msg.reply('https://tenor.com/view/cum-penis-cum-i-creamed-cumming-xd-gif-20404521');
    // }
    if (msg.content.match(/пездюк умри/gi)) {
        await msg.channel.send('https://tenor.com/view/1416-gif-25841482');
    }
    if (msg.content.match(/пездюк встань/gi)) {
        await msg.channel.send('https://tenor.com/view/resurrection-resurrect-back-from-the-dead-coffin-gif-17046161');
    }
    if (msg.content.match(/!ban/gi) || msg.content.match(/!warn/gi)) {
        const resp = await fetch(`https://api.waifu.pics/sfw/kill`)
        const data = await resp.json()
        await msg.reply('Ты так не шути, сука!');
        await msg.channel.send(data.url);
    }
    if (msg.content.match(/дехь/gi) || msg.content.match(/дэхь/gi)) {
        try {
            await msg.channel.send({
                content: null,
                embeds: [],
                stickers: ['1083120020982349975']
            });
        } catch (e) {
            console.log('Не получилось :(')
        }
    }
    if (msg.content.match(/wednesday/gi) || msg.content.match(/среда/gi)) {
        const images = [
            'https://media.discordapp.net/attachments/987305087783301130/1083481446511026206/cover1-768x512.png',
            'https://media.discordapp.net/attachments/987305087783301130/1083481446796247040/3snhzzIOZoc.png',
            'https://media.discordapp.net/attachments/987305087783301130/1083481447081451640/T5xCVq_SIxk.png',
            'https://tenor.com/view/it-is-wednesday-wednesday-my-dudes-gif-13951537',
            'https://tenor.com/view/wednesday-dudes-it-is-wednesday-my-dudes-wednesday-frog-christmas-gif-18251858',
            'https://tenor.com/view/breaking-news-frog-it-is-wednesday-my-dudes-funny-wednesday-gif-15424421'
        ]
        await msg.channel.send(images[Math.floor(Math.random()*images.length)]);
    }
}


function containsUppercase(str) {
    return /[A-ZА-ЯЁ]/.test(str);
}
function countUpper(str, limit = 6) {
    let i = 0;
    Array.from(str).forEach(letter => {
        if (containsUppercase(letter)) i++;
    })
    return (i > limit) && (((str.length / 100) * 50) < i)
}