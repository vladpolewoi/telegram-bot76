import { Bot } from 'grammy'
import { isToday, parse } from 'date-fns'
import cron from 'node-cron'

console.log('🤖 Initializing bot...')
const bot = new Bot(process.env.BOT_TOKEN || '')

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set in environment variables')
}

type Member = {
  name: string
  birthday: string
}

let members: Member[] = [
  {
    name: 'Vlad',
    birthday: '2025-01-15',
  },
  {
    name: 'Fedor',
    birthday: '2025-01-14',
  },
]

function checkBirthdays() {
  return members.filter((member) => {
    return isToday(parse(member.birthday, 'yyyy-MM-dd', new Date()))
  })
}

// cron every 10 seconds
cron.schedule('*/10 * * * * *', () => {
  const birthdays = checkBirthdays()

  if (birthdays.length > 0) {
    const chatID = process.env.CHAT_ID || ''

    if (chatID) {
      bot.api.sendMessage(chatID, 'Happy birthday!')
    } else {
      console.error('CHAT_ID is not set in environment variables')
    }
  }
})

// bot.command('getChatId', async (ctx) => {
//   const chatID = ctx.chat.id
//   console.log('Chat ID:', chatID)
//   await ctx.reply(`Your chat ID is ${chatID}`)
// })

async function startBot() {
  try {
    await bot.start()
    console.log('✅ Bot successfully started')
  } catch (error) {
    console.error('❌ Error starting bot:', error)
    process.exit(1)
  }
}

startBot()

bot.catch((err) => {
  console.error('🚨 Bot error:', err)
})
