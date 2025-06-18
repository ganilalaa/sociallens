// pages/api/upload.js
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // DUHET për formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ message: "Upload failed" });
    }

    const file = files.file;
    if (!file) {
      console.error("No file received:", files);
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadedFile = Array.isArray(file) ? file[0] : file;
    const fileUrl = `/uploads/${path.basename(uploadedFile.filepath)}`;
    const fileType = uploadedFile.mimetype;

    return res.status(200).json({
      url: fileUrl,
      type: fileType,
    });
  });
}