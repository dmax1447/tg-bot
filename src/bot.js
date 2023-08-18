const {Telegraf} = require('telegraf');
const axios = require('axios')

require('dotenv').config()


const bot = new Telegraf(process.env.DMAX1447_BOT_TOKEN);
let messages = []
let timerId = null

bot.on('message', async (ctx) => {
  console.log(ctx.message)
  if (ctx.message.text.includes('dmax1447_bot')) {
    const messageContent = ctx.message.text.replace('@dmax1447_bot', '')
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      messages = []
    }, 1000 * 60 * 5)

    if (messageContent.includes('/clear')) {
      messages = []
      ctx.reply('история сообщений очищена')
      return
    }

    if (messageContent.includes('картинка')) {
      console.log('try generate image from', messageContent)
      try {
        const result = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            "n": 1,
            "size": "512x512",
            "prompt": messageContent
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.CHAT_TOKEN}`
            },
          }
        ).then(response => response.data.data[0])
        console.log('result:')
        console.log(result.url)
        ctx.reply(result.url)
      } catch (e) {
        console.log(e.message)
        ctx.reply(Math.random() > 0.4 ? 'Устал. Убить всех человеков' : 'Bite my shiny metal ass')
      }
    } else {
      try {
        const userMessage = {
          role: 'user', content: messageContent
        }
        if (messages.length > 8) {
          messages.shift()
        }
        messages.push(userMessage)
        const result = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            "model": "gpt-3.5-turbo",
            max_tokens: 512,
            messages
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.CHAT_TOKEN}`
            },
          }
        ).then(responce => responce.data)
        const systemMessage = result.choices[0].message
        if (messages.length > 8) {
          messages.shift()
        }
        messages.push(systemMessage)
        ctx.reply(systemMessage.content)
      } catch (e) {
        console.log(e.message)
        ctx.reply(Math.random() > 0.4 ? 'Устал. Убить всех человеков' : 'Bite my shiny metal ass')
      }
    }
  }
})

bot.hears('hi', (ctx) => ctx.reply('white power!'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
