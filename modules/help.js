import fs from 'fs'

const data = fs.readFileSync('./modules/data/help.txt').toString()
const emoji1 = fs.readFileSync('./modules/data/emoji.txt').toString()
const emoji2 = fs.readFileSync('./modules/data/emoji2.txt').toString()

let emoji = [...emoji1.split('<split>'), ...emoji2.split('<split>')]


export async function messages(msg) {
    if (msg.content.match(/\?help/)) {
        if (msg.content.match(/\?help_emoji/gi)) {
            try {
                await msg.channel.send(emoji[+msg.content.replace(/[^0-9]/g, "") - 1]);
            } catch (error) {
                await msg.channel.send('Нет такой страницы');
            }
        } else {
            await msg.channel.send(data);
        }
    }
}