const axios = require("axios");
let messages = []
let timerId = null
const dotenv = require('dotenv')

dotenv.config()
const chatGPTToken = process.env.CHAT_TOKEN_KV

function imageCommandHandler(ctx) {
  const prompt = ctx.update.message.text.replace('/image', '')
  return axios.post(
    'https://api.openai.com/v1/images/generations',
    {
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chatGPTToken}`
      },
    }
  )
    .then(response => {
      const result = response.data.data[0]
      ctx.replyWithPhoto(result.url)
    })
    .catch(err => {
      ctx.reply(err.message)
    })
}

async function messageHandler(ctx) {
  const replyUser = ctx.message.reply_to_message && ctx.message.reply_to_message.from.username
  const isPrivateChat = ctx.chat.type === "private"
  const messageText = ctx.message.text || ''
  const shouldReply = messageText.includes('dmax1447_bot') || replyUser === 'dmax1447_bot' || isPrivateChat
  // console.log('raw message:', ctx.message)
  // console.log({replyUser, messageText, shouldReply})

  if (!shouldReply) {
    return
  }

  const messageContent = ctx.message.text.replace('@dmax1447_bot', '')
  if (timerId) {
    clearTimeout(timerId)
  }
  timerId = setTimeout(() => {
    messages = []
  }, 1000 * 60 * 5)

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
        model: "gpt-4.5-preview-2025-02-27",
        max_tokens: 512,
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${chatGPTToken}`
        },
      }
    ).then(response => response.data)
    const systemMessage = result.choices[0].message
    if (messages.length > 8) {
      messages.shift()
    }
    messages.push(systemMessage)
    ctx.reply(systemMessage.content)
  } catch (e) {
    ctx.reply(`Ошибка генерации ответа: ${e.message}`)
  }
}

function commandClearHandler(ctx) {
  console.log('clearHandler')
  messages = []
  ctx.reply('история сообщений очищена')
  return
}

module.exports = {
  messageHandler,
  commandClearHandler,
  imageCommandHandler
}
