import { GoogleAPI } from "https://deno.land/x/google_deno_integration/mod.ts";
import { Member } from "../entity/member.ts";

export class GssService {
  private static instance: GssService;
  private SHEET_ID: string;
  private api: GoogleAPI;

  private constructor() {
    const client_email = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const private_key = Deno.env.get("GOOGLE_PRIVATE_KEY")?.replace(
      /\\n/g,
      "\n",
    );

    if (!client_email || !private_key) {
      throw new Error("Google credentials not found in environment variables");
    }

    this.SHEET_ID = Deno.env.get("GOOGLE_SHEET_ID") || "";
    if (!this.SHEET_ID) {
      throw new Error("GOOGLE_SHEET_ID not found in environment variables");
    }

    this.api = new GoogleAPI({
      email: client_email,
      scope: ["https://www.googleapis.com/auth/spreadsheets"],
      key: private_key,
    });
  }

  public static getInstance(): GssService {
    if (!GssService.instance) {
      GssService.instance = new GssService();
    }
    return GssService.instance;
  }

  public async getMembers(): Promise<Member[]> {
    try {
      const data = await this.api.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/Amigos%20Members%20List`,
      );

      return data?.values?.filter((row: string[]) => row.length).map(
        this.parseSheetValue,
      );
    } catch (error) {
      console.error("Failed to fetch birthdays:", error);
      throw error;
    }
  }

  public async getTodayBirthdayMembers(): Promise<Member[]> {
    const members = await this.getMembers();

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    return members.filter((row) => {
      const [day, month] = row.birthday?.split(".").map(Number);
      return Number(month) === currentMonth && Number(day) === currentDay;
    });
  }

  private parseSheetValue(row: string[]): Member {
    const birthday = row[2];
    const year = birthday?.split(".")[2];
    const age = new Date().getFullYear() - Number(year);

    return {
      name: row[0],
      birthday,
      age,
    };
  }
}
