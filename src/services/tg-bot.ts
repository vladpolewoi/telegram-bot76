import "jsr:@std/dotenv/load";
import { Bot } from "npm:grammy";

export class TgBot {
  private bot: Bot;
  private static instance: TgBot;
  private chatId: string;

  private constructor() {
    const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
    const CHAT_ID = Deno.env.get("CHAT_ID");

    if (!BOT_TOKEN) {
      throw new Error("BOT_TOKEN is not set in environment variables");
    }

    if (!CHAT_ID) {
      throw new Error("CHAT_ID is not set in environment variables");
    }

    this.bot = new Bot(BOT_TOKEN);
    this.chatId = CHAT_ID;
  }

  public static getInstance(): TgBot {
    if (!TgBot.instance) {
      TgBot.instance = new TgBot();
    }

    return TgBot.instance;
  }

  public getChatId(): string {
    return this.chatId;
  }

  public async sendMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.api.sendMessage(chatId, message);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }
}
