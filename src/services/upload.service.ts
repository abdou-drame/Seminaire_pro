import fs from "fs";
import path from "path";

export class UploadService {
  /**
   * Saves a base64 encoded or binary file to local storage.
   * @param fileBase64 Base64 string payload
   * @param fileName Target filename
   * @param folder Subfolder name (e.g. "logos", "documents", "attachments")
   */
  static async saveBase64File(fileBase64: string, fileName: string, folder: string = "uploads"): Promise<string> {
    const storageDir = path.join(process.cwd(), "public", folder);

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const base64Data = fileBase64.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    const filePath = path.join(storageDir, fileName);

    await fs.promises.writeFile(filePath, base64Data, "base64");

    return `/public/${folder}/${fileName}`;
  }
}
