const { Telegraf } = require('telegraf');
require('dotenv').config()
const axios = require('axios')

const bot = new Telegraf(process.env.DMAX1447_BOT_TOKEN);

bot.on('message', async (ctx) => {
    console.log('message:', ctx.message)
    if(ctx.message.text.includes('dmax1447_bot')) {
        try {
            const result = await axios.post(
                'https://api.openai.com/v1/completions',
                {
                    "model": "text-davinci-003",
                    "prompt": ctx.message.text,
                    "max_tokens": 4000,
                    "temperature": 1.0
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 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'
                    },
                }
            ).then(responce => responce.data)
            console.log(result)
            ctx.reply(result.choices[0].text)
        } catch (e) {

        }

    }

})

bot.hears('hi', (ctx) => ctx.reply('white power!'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));