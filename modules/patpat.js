export async function messages(msg) {
    if (msg.content.match(/пат пат/gi)) {
        if (msg.content.match(/пат пат Томиок/gi)) {
            await msg.reply('https://media.discordapp.net/attachments/1010953544431587359/1083413471368073226/t_1.gif');
        } else if (msg.content.match(/пат пат гриб/gi)) {
            await msg.reply('https://cdn.discordapp.com/attachments/987305087783301130/1083427949035913266/osipat3.gif');
        } else if (msg.content.match(/пат пат замик/gi)) {
            await msg.reply('https://cdn.discordapp.com/attachments/1036197680554180658/1083735802921627749/f245b351-163f-41f8-bff3-b5d45f104bc3.gif');
        } else if (msg.content.match(/пат пат ави/gi) || msg.content.match(/пат пат вит/gi)) {
            await msg.reply('https://cdn.discordapp.com/attachments/987305087783301130/1083736883491786834/v_1.gif');
        } else if (msg.content.match(/пат пат арбок/gi) || msg.content.match(/пат пат arbok/gi)) {
            await msg.reply('https://cdn.discordapp.com/attachments/1083356421686571008/1083739027162804324/ea5cf4d5-af2f-4aa7-a6d7-512cde98bf25.gif');
        } else if (msg.content.match(/пат пат кает/gi)) {
            await msg.reply('https://media.discordapp.net/attachments/644586325609021440/1030916714180907008/989f5f50-229a-4dd2-bf7a-597c86d48c95.gif');
        } else if (msg.content.match(/пат пат депр/gi)) {
            await msg.reply('https://cdn.discordapp.com/attachments/987305087783301130/1084036229349253210/0f51be48-efd4-4e6e-ac32-c282fd3bd545.gif');
        } else if (msg.content.match(/пат пат криг/gi) || msg.content.match(/пат пат krig/gi)) {
            await msg.reply('https://cdn.discordapp.com/attachments/1083355824841314334/1097534708553891860/5591670c-faa7-4e82-a97e-77cc7945abe7.gif');
        } else if (msg.content.match(/пат пат прет/gi) ||
            msg.content.match(/пат пат прэт/gi) ||
            msg.content.match(/пат пат прит/gi) ||
            msg.content.match(/пат пат H06FZ36/gi) ||
            msg.content.match(/пат пат pret/gi) ||
            msg.content.match(/пат пат prit/gi) ||
            msg.content.match(/пат пат pr3/gi) ||
            msg.content.match(/пат пат pret/gi) ||
            msg.content.match(/пат пат лакерн/gi)||
            msg.content.match(/пат пат свин/gi)) {
            await msg.reply('смЭрть нахоЭ');
            await msg.channel.send('https://tenor.com/view/kill-you-chuckie-dog-murder-costume-gif-15089259');
        } else if (msg.content.match(/пат пат 秦始皇帝/gi)) {
            msg.reply('https://cdn.discordapp.com/attachments/1083355824841314334/1102617725429354626/859db53b-debf-44b9-a3af-3a5d1394657b.gif')
        } else if (msg.content.match(/пат пат ширин/gi) ||
            msg.content.match(/пат пат шырын/gi) ||
            msg.content.match(/пат пат сын/gi)||
            msg.content.match(/пат пат бот/gi)||
            msg.content.match(/пат пат пездюк/gi)) {
            msg.reply('https://tenor.com/view/pat-self-gif-10453294')
        } else if (msg.content.match(/пат пат жус/gi) ||
            msg.content.match(/пат пат жуз/gi) ||
            msg.content.match(/пат пат джус/gi) ||
            msg.content.match(/пат пат сок/gi)||
            msg.content.match(/пат пат джуз/gi)) {
            msg.channel.send('https://tenor.com/view/anime-boy-snowy-smile-grateful-gif-17366037')
        } else {
            await msg.reply('кто?');
            await msg.channel.send('https://tenor.com/view/question-kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen-kaguya-sama-love-is-war-shinomiya-kaguya-chika-fujiwara-gif-22035000');
        }
    }
}