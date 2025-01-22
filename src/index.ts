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
    name: 'Vlad 22',
    birthday: '2020-01-22',
  },
  {
    name: 'Vlad 23',
    birthday: '1998-01-23',
  },
  {
    name: 'Vlad 24',
    birthday: '2005-01-24',
  },
  {
    name: 'Vlad 25',
    birthday: '2006-01-25',
  },
  {
    name: 'Vlad 26',
    birthday: '2007-01-26',
  },
]

let isRunning = true

function checkBirthdays() {
  const today = new Date()

  return members.filter((member) => {
    const birthday = parse(member.birthday, 'yyyy-MM-dd', new Date())

    // Compare only month and day
    return (
      birthday.getMonth() === today.getMonth() &&
      birthday.getDate() === today.getDate()
    )
  })
  // .map((member) => {
  //   const birthYear = parseInt(member.birthday.split('-')[0])
  //   const age = today.getFullYear() - birthYear
  //   return { ...member, age }
  // })
}

cron.schedule('0 12 * * *', () => {
  // cron.schedule('*/10 * * * * *', () => {
  if (!isRunning) return

  const membersWithBirthdays = checkBirthdays()

  if (membersWithBirthdays.length > 0) {
    const chatID = process.env.CHAT_ID || ''

    if (!chatID) {
      console.error('CHAT_ID is not set in environment variables')
      return
    }

    membersWithBirthdays.forEach((member) => {
      const today = new Date()
      const date = parse(member.birthday, 'yyyy-MM-dd', new Date())
      const age = today.getFullYear() - date.getFullYear()

      bot.api.sendMessage(chatID, `Happy birthday ${member.name}! He is ${age}`)
    })
  }
})

bot.api.setMyCommands([
  { command: 'stop', description: 'Stop the bot' },
  { command: 'start', description: 'Start the bot' },
])

bot.command('stop', async (ctx) => {
  isRunning = false
  await ctx.reply('Bot stopped')
})

bot.command('start', async (ctx) => {
  isRunning = true
  await ctx.reply('Bot started')
})

// bot.command('getChatId', async (ctx) => {
//   await ctx.reply(`Your chat ID is ${ctx.chat.id}`)
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
