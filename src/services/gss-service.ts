import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
} from "npm:google-spreadsheet";
import { JWT } from "npm:google-auth-library";

export interface MemberRow {
  name: string;
  birthday: string;
  age: number;
}

export class GssService {
  private static instance: GssService;
  private sheet: GoogleSpreadsheet;

  private constructor() {
    const credentials = {
      client_email: Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
      private_key: Deno.env.get("GOOGLE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
    };

    if (!credentials.client_email || !credentials.private_key) {
      throw new Error("Google credentials not found in environment variables");
    }

    const SHEET_ID = Deno.env.get("GOOGLE_SHEET_ID");
    if (!SHEET_ID) {
      throw new Error("GOOGLE_SHEET_ID not found in environment variables");
    }

    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheet = new GoogleSpreadsheet(SHEET_ID, auth);
  }

  public static getInstance(): GssService {
    if (!GssService.instance) {
      GssService.instance = new GssService();
    }
    return GssService.instance;
  }

  public async getMembers(): Promise<MemberRow[]> {
    try {
      await this.sheet.loadInfo();
      const worksheet = this.sheet.sheetsByIndex[1]; // Get first sheet
      const rows = await worksheet.getRows();

      return rows.map((row: GoogleSpreadsheetRow) => {
        const birthday = row.get("Birthday");
        const year = birthday.split(".")[2];
        const age = new Date().getFullYear() - Number(year);

        return {
          name: row.get("Name"),
          birthday,
          age,
        };
      });
    } catch (error) {
      console.error("Failed to fetch birthdays:", error);
      throw error;
    }
  }

  public async getTodayBirthdayMembers(): Promise<MemberRow[]> {
    const members = await this.getMembers();

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
    const currentDay = today.getDate();

    return members.filter((row) => {
      const [day, month] = row.birthday.split(".").map(Number);
      return Number(month) === currentMonth && Number(day) === currentDay;
    });
  }
}
