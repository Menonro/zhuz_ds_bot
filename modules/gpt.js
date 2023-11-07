import fetch from 'node-fetch'

const url = 'http://localhost:5001/api/v1/generate'

export async function messages(msg) {
    if (msg.content[0] === '%') {
        await msg.channel.sendTyping();
        let data = msg.content.substr(1)
        data.trim()
        const user = msg.author.id

        const req = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                prompt: data,
                temperature: 0.3,
                genkey: user,
                max_context_length: 120,
                max_length: 256,
                rep_pen: 1.1,
                top_p: 0.92,
                // top_k: 0,
                // top_a: 0,
                // typical: 1,
                // tfs: 1,
                rep_pen_range: 1024,
                rep_pen_slope: 0.7,
                // sampler_order: [6, 0, 1, 3, 4, 2, 5],
                // quiet: true,
                use_default_badwordsids: true
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        try {
            const resp = await req.json()
            let response = resp.results?.reduce((p,n) => p + "\n\r" + n.text, '')
            await msg.reply(response && response.length > 0 ? response : '<я думаю над другим вопросом, спроси позже>');
        } catch (error) {
            await msg.reply(error.message);
        }
    }
}
