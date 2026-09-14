import fs from "fs";
import path from "path";
import crypto from "crypto";

const ensureDirectoryExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, {
      recursive: true,
    });
  }
};

const generateSafeFileName = (originalName) => {
  const extension = path.extname(originalName).toLowerCase();

  const uniqueId = crypto.randomBytes(8).toString("hex");

  return `${Date.now()}-${uniqueId}${extension}`;
};

const deleteFile = (filePath) => {
  if (!filePath) return;

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export {
  ensureDirectoryExists,
  generateSafeFileName,
  deleteFile,
};