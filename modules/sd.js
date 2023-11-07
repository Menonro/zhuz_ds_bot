import fetch from 'node-fetch'
import Discord from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import * as fs from 'node:fs/promises';
import png from 'png-metadata'

import { getWhitelist } from '../whitelist.js'

const url = 'http://localhost:7860'
const txt2img = '/sdapi/v1/txt2img'
const extras = '/sdapi/v1/extra-single-image'
const options = '/sdapi/v1/options'
const vaes = '/sdapi/v1/sd-vae'
const models = '/sdapi/v1/sd-models'

const ModelInList = 20

export async function commands () {
    console.log('Перезагружаю модели...');
    await fetch(url + '/sdapi/v1/refresh-checkpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    console.log('Перезагружаю vae...');
    await fetch(url + '/sdapi/v1/refresh-vae', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    console.log('Перезагружаю лоры...');
    await fetch(url + '/sdapi/v1/refresh-loras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    console.log('Готово');
    const req = await fetch(url + models, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    const resp = await req.json()

    return [
        {
            name: 'vae',
            description: 'Изменить VAE нейронки',
        },
        {
            name: 'model',
            description: 'Изменить Модель нейронки',
            options: [
                {
                    name: 'pack',
                    description: 'Набор',
                    required: true,
                    type: 3,
                    choices: createAndMapArray(resp, ModelInList, function (_, i) {
                        return {
                            name: `Набор моделей ${i + 1}`,
                            value: `${i}`
                        };
                    })
                }
            ]
        },
        {
            name: 'clip',
            description: 'Изменить CLIP skip нейронки',
        },
        {
            name: 'gen',
            description: 'Сгенерировать картинку, но манипулируя настройками',
            options: [
                {
                    name: 'prompt',
                    description: 'Основной запрос',
                    required: true,
                    type: 3,
                },
                {
                    name: 'style',
                    description: 'Готовые positive и negative для хорошей картинки, по умолчанию ДА',
                    type: 5,
                },
                {
                    name: 'negative',
                    description: 'Отрицательный запрос',
                    type: 3,
                },
                {
                    name: 'width',
                    type: 4,
                    min_value: 128,
                    max_value: 768,
                    description: '512',
                },
                {
                    name: 'height',
                    type: 4,
                    min_value: 128,
                    max_value: 768,
                    description: '768',
                },
                {
                    name: 'steps',
                    type: 4,
                    min_value: 1,
                    max_value: 80,
                    description: '50',
                },
                {
                    name: 'cfg_scale',
                    type: 4,
                    min_value: 3,
                    max_value: 13,
                    description: '7',
                },
                {
                    name: 'seed',
                    type: 3,
                    description: '-1',
                },
                {
                    name: 'sampler',
                    type: 3,
                    description: 'DPM++ 2M Karras',
                },
                {
                    name: 'hr',
                    type: 5,
                    description: 'Да',
                },
                {
                    name: 'hr_upscaler',
                    type: 3,
                    description: 'Latent (nearest-exact)',
                },
                {
                    name: 'hr_steps',
                    type: 4,
                    min_value: 0,
                    max_value: 40,
                    description: '20',
                },
                {
                    name: 'hr_scale',
                    type: 4,
                    min_value: 125,
                    max_value: 200,
                    description: '200%',
                },
                {
                    name: 'hr_denoising_strength',
                    type: 4,
                    min_value: 5,
                    max_value: 100,
                    description: '60%',
                },
            ]
        }
    ]
};


let queueList = []
export async function messages(msg, client) {
    if (msg.content[0] === '*' || msg.content[0] === '=') {
        if (msg.author.id == process.env.SLIME) {
            await msg.reply('https://images-ext-2.discordapp.net/external/TEKp-LWcqB-286jKikhy13a6MfJTkDyUu7MdfnnhVqg/https/i.pinimg.com/1200x/b9/0f/72/b90f72cdd73d129c7138097bc3cfe4ec.jpg?width=1085&height=612')
            return;
        };
        let channel = msg.channel
        if (msg.channel.id == process.env.MAIN_CHANNEL) {
            channel = await client.channels.fetch(process.env.SECOND_CHANNEL)
        }
        await channel.sendTyping();
        let data = msg.content.substr(1)
        data.trim()
        const user = msg.author.id
        const tempMsg = await channel.send(queueList.length > 0 ? `Перед вами **${queueList.length}** в очереди` : 'Делаю...');
        await generate(user, channel, tempMsg, {
            prompt: data,
            width: msg.content[0] === '*' ? 512 : 768,
            height: msg.content[0] === '*' ? 768 : 512,
        }, true);
    }

    if (msg.content === '+') {
        if (msg.reference) {
            const prevMsg = await msg.channel.messages.fetch(msg.reference.messageId)
            if (prevMsg.author.id === process.env.APP_ID) {
                const attach = Array.from(prevMsg.attachments)[0]
                if (attach) {
                    const __filename = fileURLToPath(import.meta.url);
                    const __dirname = path.dirname(__filename);
                    var dir = path.resolve(__dirname, './saves/', (new Date).toLocaleDateString());

                    let content = await fs.readFile(path.resolve(dir, attach[1].name), {encoding: 'base64'})
                    const req = await fetch(url + extras, {
                        method: 'POST',
                        body: JSON.stringify({
                            "resize_mode": 0,
                            "show_extras_results": true,
                            "gfpgan_visibility": .95,
                            "upscaling_resize": 4,
                            "upscaler_1": "R-ESRGAN 4x+",
                            "upscaler_2": "R-ESRGAN 4x+ Anime6B",
                            "extras_upscaler_2_visibility": .95,
                            "image": content
                          }),
                        headers: { 'Content-Type': 'application/json' }
                    })
                    const resp = await req.json()
                    let buff = Buffer.from(resp.image, 'base64');
                    await fs.writeFile(path.resolve(dir, `${attach[1].name.split('.')[0]}_extra.png`), buff);
                    await msg.reply({
                        files: [
                            new Discord.AttachmentBuilder(
                                path.resolve(dir, `${attach[1].name.split('.')[0]}_extra.png`),
                                { name: `${attach[1].name.split('.')[0]}_extra.png` }
                            ),
                        ]
                    });
                }
            }
            // await
            // await msg.channel.send(`<@${msg.author.id}> ${command[1]} <@${msg.mentions.repliedUser.id}>`);
        }
    }

    if (msg.content === '!info') {
        if (msg.reference) {
            const prevMsg = await msg.channel.messages.fetch(msg.reference.messageId)
            if (prevMsg.author.id === process.env.APP_ID) {
                const attach = Array.from(prevMsg.attachments)[0]
                if (attach) {
                    const __filename = fileURLToPath(import.meta.url);
                    const __dirname = path.dirname(__filename);
                    var dir = path.resolve(__dirname, './saves/', (new Date).toLocaleDateString());

                    let content = png.readFileSync(path.resolve(dir, attach[1].name))
                    try {
                        await msg.reply(png.splitChunk(content).find(e=>e.type == 'tEXt')?.data);
                    } catch (error) {
                        console.log('Info empty');
                    }
                }
            }
            // await
            // await msg.channel.send(`<@${msg.author.id}> ${command[1]} <@${msg.mentions.repliedUser.id}>`);
        }
    }

    if (msg.content === '!model') {
        await msg.channel.sendTyping();
        try {
            const req = await fetch(url + options, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const resp = await req.json()
            await msg.channel.send(`Модель: **${resp.sd_model_checkpoint}**\nVAE: **${resp.sd_vae}**\nCLIP skip: **${resp.CLIP_stop_at_last_layers}**`);
        } catch (error) {
            await msg.reply(error.message);
        }
    }

    if (msg.content === '!lora') {
        await msg.channel.sendTyping();
        try {
            const req = await fetch(url + '/sdapi/v1/loras', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const resp = await req.json()
            const chunkSize = 20;
            for (let i = 0; i < resp.length; i += chunkSize) {
                const chunk = resp.slice(i, i + chunkSize);
                await msg.channel.send(chunk.map(e => {
                    const keys = Object.keys(e?.metadata?.ss_tag_frequency || {})
                    return `<lora\\:${e.alias}\\:0.8>${keys.length ? ',' : ''} ${keys.length ? keys.map(key => getTopKeys(e.metadata.ss_tag_frequency[key]).join(', '))[0] : ''}`
                }).join("\n"));
            }
        } catch (error) {
            await msg.reply(error.message);
        }
    }

    if (msg.content === '!очередь') {
        msg.reply(queueList.reduce((a,b) => `${a}${a ? "\n" : ''}${b[1] + 1} - ${b[0].url}`, '') || 'Пусто')
    }
}

export async function interactive(interaction) {
    if (interaction.commandName === 'vae') {
        if (getWhitelist().whitelist.servers.TL == interaction.guild.id + '' && interaction.user.id != getWhitelist().admin.me) {
            return await interaction.reply({
                content: 'Недостаточно полномочий',
                components: [],
            });
        }
        const req = await fetch(url + vaes, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        const resp = await req.json()

        const select = new Discord.StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Выберите...')
			.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Не менять')
                    .setValue('false'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Automatic')
                    .setValue('Automatic'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('None')
                    .setValue('None'),
                ...resp.map(vae => new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(vae.model_name)
                    .setValue(vae.model_name)
                )
			);
        const row = new Discord.ActionRowBuilder().addComponents(select);
        const response = await interaction.reply({
            content: 'Выбери VAE для изменения',
            components: [row],
        });
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const newVAE = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (newVAE.values.length && newVAE.values[0] !== 'false') {
                await interaction.editReply({ content: `Устанавливаю ${newVAE.values[0]}...`, components: [] });
                await fetch(url + options, {
                    method: 'POST',
                    body: JSON.stringify({
                        sd_vae: newVAE.values[0]
                    }),
                    headers: { 'Content-Type': 'application/json' }
                })
                await interaction.editReply({ content: `${newVAE.values[0]} будет новой VAE`, components: [] });
            } else {
                await interaction.editReply({
                    content: 'Отменено',
                    components: [],
                })
            }
        } catch (e) {
            await interaction.editReply({ content: `Время вышло, используйте команду снова, ${e}`, components: [] });
        }
    }
    if (interaction.commandName === 'model') {
        if (getWhitelist().whitelist.servers.TL == interaction.guild.id + '' && interaction.user.id != getWhitelist().admin.me) {
            return await interaction.reply({
                content: 'Недостаточно полномочий',
                components: [],
            });
        }
        const req = await fetch(url + models, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        const resp = await req.json()
        const pack = interaction.options.get('pack')

        const select = new Discord.StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Выберите...')
			.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Не менять')
                    .setValue('false'),
                ...resp.slice(+pack.value * ModelInList, (+pack.value + 1) * ModelInList).map(vae => new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(vae.model_name)
                    .setValue(vae.title)
                )
			);
        const row = (new Discord.ActionRowBuilder()).addComponents(select);
        const response = await interaction.reply({
            content: 'Выбери Модель для изменения',
            components: [row],
        });
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const newVAE = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (newVAE.values.length && newVAE.values[0] !== 'false') {
                await interaction.editReply({ content: `Устанавливаю ${newVAE.values[0]}...`, components: [] });
                await fetch(url + options, {
                    method: 'POST',
                    body: JSON.stringify({
                        sd_model_checkpoint: newVAE.values[0]
                    }),
                    headers: { 'Content-Type': 'application/json' }
                })
                await interaction.editReply({ content: `${newVAE.values[0]} будет новой моделью`, components: [] });
            } else {
                await interaction.editReply({
                    content: 'Отменено',
                    components: [],
                })
            }
        } catch (e) {
            await interaction.editReply({ content: `Время вышло, используйте команду снова, ${e}`, components: [] });
        }
    }
    if (interaction.commandName === 'clip') {
        if (getWhitelist().whitelist.servers.TL == interaction.guild.id + '' && interaction.user.id != getWhitelist().admin.me) {
            return await interaction.reply({
                content: 'Недостаточно полномочий',
                components: [],
            });
        }
        const select = new Discord.StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Выберите...')
			.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Не менять')
                    .setValue('false'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('1')
                    .setValue('1'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('2')
                    .setValue('2'),
			);
        const row = new Discord.ActionRowBuilder().addComponents(select);
        const response = await interaction.reply({
            content: 'Выбери CLIP skip для изменения',
            components: [row],
        });
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const newVAE = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (newVAE.values.length && newVAE.values[0] !== 'false') {
                await interaction.editReply({ content: `Устанавливаю ${newVAE.values[0]}...`, components: [] });
                await fetch(url + options, {
                    method: 'POST',
                    body: JSON.stringify({
                        CLIP_stop_at_last_layers: +newVAE.values[0]
                    }),
                    headers: { 'Content-Type': 'application/json' }
                })
                await interaction.editReply({ content: `${newVAE.values[0]} будет новым CLIP skip`, components: [] });
            } else {
                await interaction.editReply({
                    content: 'Отменено',
                    components: [],
                })
            }
        } catch (e) {
            await interaction.editReply({ content: `Время вышло, используйте команду снова, ${e}`, components: [] });
        }
    }
    if (interaction.commandName === 'gen') {
        const tempMsg = await interaction.reply({
            content: queueList.length > 0 ? `Перед вами **${queueList.length}** в очереди` : 'Делаю...',
            components: [],
        });
        await generate(interaction.user.id, interaction.channel, tempMsg, {
            prompt: interaction.options.get('prompt').value.replace('*', '').replace('=', ''),
            negative: interaction.options.get('negative')
                ? interaction.options.get('negative').value
                : '',
            seed: interaction.options.get('seed')
                ? +interaction.options.get('seed').value
                : -1,
            sampler: interaction.options.get('sampler')
                ? interaction.options.get('sampler').value
                : 'DPM++ 2M Karras',
            steps: interaction.options.get('steps')
                ? +interaction.options.get('steps').value
                : 50,
            cfg_scale: interaction.options.get('cfg_scale')
                ? +interaction.options.get('cfg_scale').value
                : 7,
            width: interaction.options.get('width')
                ? +interaction.options.get('width').value
                : 512,
            height: interaction.options.get('height')
                ? +interaction.options.get('height').value
                : 768,
            hr: interaction.options.get('hr')
                ? interaction.options.get('hr').value
                : true,
            hr_scale: interaction.options.get('hr_scale')
                ? +interaction.options.get('hr_scale').value / 100
                : 2,
            hr_upscaler: interaction.options.get('hr_upscaler')
                ? interaction.options.get('hr_upscaler').value
                : 'Latent (nearest-exact)',
            hr_steps: interaction.options.get('hr_steps')
                ? interaction.options.get('hr_steps').value
                : 20,
            hr_denoising_strength: interaction.options.get('hr_denoising_strength')
                ? interaction.options.get('hr_denoising_strength').value / 100
                : .6,
        }, interaction.options.get('style') ? interaction.options.get('style').value : true);
    }
}

function getTopKeys(obj, len = 3) {
    const sortedArray = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    const top10 = sortedArray.slice(0, len);
    const topKeys = top10.map(([key, value]) => key);
    return topKeys;
}

function createAndMapArray(inputArray, chunkSize, mappingFunction) {
    const result = [];
    for (let i = 0; i < inputArray.length; i += chunkSize) {
      const chunk = inputArray.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result.map(mappingFunction);
}

async function generate(user, channel, tempMsg, params, style = true) {
    queueList.push([
        tempMsg,
        queueList.length
    ])
    const config = {
        prompt: params.prompt,
        negative_prompt: params.isset('negative') ? params.negative : "",
        styles: style ? [ "base" ] : [],
        seed: params.isset('seed') ? params.seed : -1,
        sampler_name: params.isset('sampler') ? params.sampler : "DPM++ 2M Karras",
        batch_size: 1,
        n_iter: 1,
        steps: params.isset('steps') ? params.steps : 50,
        cfg_scale: params.isset('cfg_scale') ? params.cfg_scale : 7,
        width: params.isset('width') ? params.width : 512,
        height: params.isset('height') ? params.height : 768,
        send_images: true,
        save_images: true,
        enable_hr: params.isset('hr') ? params.hr : true,
        hr_scale: params.isset('hr_scale') ? params.hr_scale : 2,
        hr_upscaler: params.isset('hr_upscaler') ? params.hr_upscaler : 'Latent (nearest-exact)',
        hr_second_pass_steps: params.isset('hr_steps') ? params.hr_steps : 20,
        denoising_strength: params.isset('hr_denoising_strength') ? params.hr_denoising_strength : .6
    }
    await channel.sendTyping();
    try {
        const req = await fetch(url + txt2img, {
            method: 'POST',
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        })
        const resp = await req.json()
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        var dir = path.resolve(__dirname, './saves/', (new Date).toLocaleDateString());
        if (!existsSync(dir)) mkdirSync(dir);

        let nameInt = await fs.readdir(dir)
        let buff = Buffer.from(resp.images[0], 'base64');
        await fs.writeFile(path.resolve(dir, `${nameInt.length}.png`), buff);
        await tempMsg.edit({
            content: `Готово <@${user}>`,
            files: [
                new Discord.AttachmentBuilder(
                    path.resolve(dir, `${nameInt.length}.png`),
                    { name: `${nameInt.length}.png` }
                ),
                // new Discord.AttachmentBuilder(
                //     'https://cdn.discordapp.com/attachments/1083823919284355183/1163981483950755932/done.ogg?ex=65418d3b&is=652f183b&hm=2643adbea1886f801989456d48fdab3739a162486b212e3e08a5dfb6c0a15322&',
                //     { name: `done.ogg` }
                // )
            ]
        });
        const msgPing = await channel.send(`<@${user}> тык`);
        await msgPing.delete()
    } catch (error) {
        console.log(error);
        await tempMsg.edit(error.message);
    }
    queueList = queueList.filter(e => e[0].id !== tempMsg.id)
    for (let i = 0; i < queueList.length; i++) {
        const val = queueList[i][1] - 1
        queueList[i][1] = val;
        await queueList[i][0].edit(val > 0 ? `Перед вами **${val + 1}** в очереди` : 'Делаю...');
    }
}