import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { TgBot } from "@/services/tg-bot.ts";
import { GssService, MemberRow } from "@/services/gss-service.ts";

Deno.serve(async () => {
  const bot = TgBot.getInstance();
  const chatId = bot.getChatId();

  const gss = GssService.getInstance();
  const todayBirthdayMembers: MemberRow[] = await gss.getTodayBirthdayMembers();

  if (todayBirthdayMembers.length > 0) {
    await Promise.all(
      todayBirthdayMembers.map(async (member) => {
        await bot.sendMessage(
          chatId,
          `🎊🎁 У ${member.name} сегодня праздник — День Рождения! Желаем, чтобы Господь наполнил жизнь радостью и духовным ростом. 🙏 Давайте порадуем ${member.name} поздравлениями и добрыми словами!`,
        );
      }),
    );
  }

  return new Response("Message sent", {
    status: 200,
  });
});
