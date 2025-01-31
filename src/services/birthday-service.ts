import { Member } from "../entity/member.ts";
import { birthdayMessageTemplates } from "../config/birthdayMessageTemplates.ts";

export class BirthdayService {
  private constructor() {}

  static getRandomBirthdayMessage(member: Member): string {
    const randomIndex = Math.floor(
      Math.random() * birthdayMessageTemplates.length,
    );

    return birthdayMessageTemplates[randomIndex].replace(
      /\[Имя\]/g,
      member.name,
    );
  }
}
