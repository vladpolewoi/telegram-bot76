import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { TgBot } from "@/services/tg-bot.ts";
import { GssService } from "@/services/gss-service.ts";
import { BirthdayService } from "@/services/birthday-service.ts";
import { Member } from "@/entity/member.ts";

Deno.serve(async () => {
  const bot = TgBot.getInstance();
  const chatId = bot.getChatId();

  const gss = GssService.getInstance();
  const todayBirthdayMembers: Member[] = await gss.getTodayBirthdayMembers();

  if (todayBirthdayMembers.length > 0) {
    await Promise.all(
      todayBirthdayMembers.map(async (member) => {
        const birthdayMessage = BirthdayService.getRandomBirthdayMessage(
          member,
        );

        await bot.sendMessage(
          chatId,
          birthdayMessage,
        );
      }),
    );
  }

  return new Response("Message sent", {
    status: 200,
  });
});
