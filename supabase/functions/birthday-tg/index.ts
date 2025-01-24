import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import "jsr:@std/dotenv/load";

import { Bot } from "npm:grammy";
import { parse } from "npm:date-fns";

type Member = {
  name: string;
  birthday: string;
};

const members: Member[] = [
  {
    name: "Vlad 22",
    birthday: "2020-01-22",
  },
  {
    name: "Vlad 23",
    birthday: "1998-01-23",
  },
  {
    name: "Vlad 24",
    birthday: "2005-01-24",
  },
  {
    name: "Sem 24.2",
    birthday: "1998-01-24",
  },
  {
    name: "Vlad 25",
    birthday: "2006-01-25",
  },
  {
    name: "Vlad 26",
    birthday: "2007-01-26",
  },
];

function checkBirthdays() {
  const today = new Date();

  return members.filter((member) => {
    const birthday = parse(member.birthday, "yyyy-MM-dd", new Date());

    // Compare only month and day
    return (
      birthday.getMonth() === today.getMonth() &&
      birthday.getDate() === today.getDate()
    );
  });
}

Deno.serve(async () => {
  const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "";
  const CHAT_ID = Deno.env.get("CHAT_ID") || "";

  try {
    console.log("🤖 Initializing bot...");
    const bot = new Bot(BOT_TOKEN);

    if (!BOT_TOKEN) {
      throw new Error("BOT_TOKEN is not set in environment variables");
    }

    const membersWithBirthdays = await checkBirthdays();

    if (membersWithBirthdays.length > 0) {
      if (!CHAT_ID) {
        return new Response(JSON.stringify({ error: "CHAT_ID is not set" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      await Promise.all(membersWithBirthdays.map(async (member) => {
        const today = new Date();
        const [year] = member.birthday.split("-").map(Number);
        const age = today.getFullYear() - year;
        console.log("SENDIND", member.name, age);

        await bot.api.sendMessage(
          CHAT_ID,
          `Happy birthday ${member.name}! He is ${age}`,
        );
      }));
    }

    return new Response(JSON.stringify({ message: "Birthdays checked 2" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
