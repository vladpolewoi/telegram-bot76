# Telegram Birthday Bot

A Telegram bot built with grammY that sends birthday notifications to specified chats.

## Features

- 🎂 Automated birthday notifications
- ⏰ Configurable notification schedule using cron jobs
- 🤖 Easy-to-use bot commands
- 📅 Integration with date-fns for date handling

## Tech Stack

- TypeScript
- [grammY](https://grammy.dev/) - Telegram Bot Framework
- [Bun](https://bun.sh/) - JavaScript runtime & package manager
- [node-cron](https://github.com/node-cron/node-cron) - Task scheduler
- [date-fns](https://date-fns.org/) - Date utility library

## Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Telegram Bot Token (get it from [@BotFather](https://t.me/botfather))

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/telegram-birthday-bot.git
cd telegram-birthday-bot
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables by creating a `.env` file:

```env
BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_chat_id
```

## Getting Started

1. Get your Bot Token:

   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Create a new bot using the `/newbot` command
   - Copy the token provided

2. Get your Chat ID:

   - Add your bot to the desired group
   - Uncomment the `getChatId` command in `src/index.ts`
   - Send `/getChatId` in your group
   - Copy the returned ID to your `.env` file

3. Configure birthdays in `src/index.ts`:

```typescript
let members = [
  {
    name: 'John',
    birthday: '2024-03-15', // Format: YYYY-MM-DD
  },
  // Add more members...
]
```

## Running the Bot

Development mode:

```bash
bun dev
```

Production mode:

```bash
bun start
```

## Customizing Notifications

The bot checks for birthdays using a cron schedule. Default is every 10 seconds:

```typescript
cron.schedule('*/10 * * * * *', () => {
  // Birthday check logic
})
```

Common cron patterns:

- Every minute: `* * * * *`
- Every hour: `0 * * * *`
- Daily at 9 AM: `0 9 * * *`
- Every 30 minutes: `*/30 * * * *`

## Project Structure

```
├── src/
│   └── index.ts    # Main bot logic
├── .env            # Environment variables
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/telegram-birthday-bot/issues) page
2. Open a new issue if needed

## Acknowledgments

- [grammY documentation](https://grammy.dev/guide/)
- [Bun documentation](https://bun.sh/docs)
- [node-cron documentation](https://github.com/node-cron/node-cron#readme)
