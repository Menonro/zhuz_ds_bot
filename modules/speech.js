import fs from 'fs'
import request from 'request';
import { exec } from "child_process";


export async function messages(msg) {
    const attachments = Array.from(msg.attachments)
    if (attachments.length === 1) {
        const info = attachments[0][1];
        if (info.name == 'voice-message.ogg' && info.contentType == 'audio/ogg') {
            const replyMessage = await msg.reply({
                content: 'Начинаю дешифровать двачерскую речь...',
                allowedMentions: { repliedUser: false }
            })
            if (info.size < 300000) {
                try {
                    await new Promise((res, rej) => {
                        request(info.url)
                            .pipe(fs.createWriteStream(`./tmp/${info.id}.ogg`))
                            .on('finish', res)
                            .on('error', rej)
                    })
                    await new Promise((res, rej) => {
                        exec(
                            `${process.env.SPEACH_FILDER}/whisper-faster.exe ./tmp/${info.id}.ogg --language Russian --beep_off --output_format text --output_dir ./tmp/`,
                            {
                                windowsHide: true
                            },
                            res
                        )
                    })
                    const text = fs.readFileSync(`./tmp/${info.id}.text`).toString()
                    replyMessage.edit(text)
                } catch (error) {
                    console.log(error);
                    replyMessage.edit('Не получилось дешифровать по причине: ' + error)
                }
                try {
                    // fs.unlinkSync(`./tmp/${info.id}.ogg`)
                } catch (error) {
                    console.log(error);
                }
                    // .pipe(() => console.log(arguments, 'Чо'))
            } else {
                msg.reply('Слишком длинное сообщение, не буду переводить, sorry', {
                    allowed_mentions: {
                        replied_user: false
                    }
                });
            }
        }
    }
}
