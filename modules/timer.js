import fetch from 'node-fetch'
import bad from './data/bad.json' assert { type: 'json' }
import nice from './data/nice.json' assert { type: 'json' }

const reg = /<@\d{3,}>/gi

export async function messages(msg) {
    if (msg.content.match(/таймер/gi)) {
        const msg2 = await msg.channel.send('Бомба активирована...');
        await resolveAfter1Second()
        for (let i = 5; i > 0; i--) {
            msg2.edit(`взрыв через: ${i}...`)
            await resolveAfter1Second()
        }
        msg2.edit(`https://tenor.com/view/explosion-boom-gif-6755110088236923667`)
        await resolveAfter1Second()
        await resolveAfter1Second()
        await resolveAfter1Second()
        // await msg.delete()
        await msg2.delete()
    }
}

function resolveAfter1Second() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 1000);
    });
}
