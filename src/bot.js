const {Telegraf} = require('telegraf');
const axios = require('axios')
const dotenv = require('dotenv')
const {messageHandler, commandClearHandler, imageCommandHandler} = require('./handlers')

dotenv.config()
const tgBotToken = process.env.DMAX1447_BOT_TOKEN

function initBot(botToken) {
  console.log('starting bot')
  const bot = new Telegraf(botToken);
  bot.telegram.setMyCommands([
    {
      command: 'clear',
      description: 'Clear cache ',
    }
  ]);
  bot.command('clear', commandClearHandler)
  bot.command('image', imageCommandHandler)
  bot.on('message', messageHandler)
  bot.launch()
}

initBot(tgBotToken)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
