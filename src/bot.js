const { Telegraf } = require('telegraf');

const bot = new Telegraf('5977297894:AAF2MF9fR1m9ridIBjAX0HhSKC0W6w1O7s0');
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.on ('message',(ctx) => {
    console.log('message from:', ctx.from.username)
    console.log('message:', ctx.message)
    if (ctx.message.text.includes('жид')) {
        ctx.reply('хайль гителер!')
    }
    if (ctx.from.username === 'VladFilatoff') {
        ctx.reply('Я тебя узнал, сраный Капитан Америка!')

    }
    ctx.reply('kill all humans')
})

bot.hears('hi', (ctx) => ctx.reply('white power!'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));