import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_PATH = process.env.UPLOAD_PATH
  ? path.resolve(process.env.UPLOAD_PATH)
  : path.join(__dirname, "..", "..", "uploads", "documents");

const ALLOWED_MIMETYPES = ["application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FIELD_NAME = "archivo";

if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (_req, _file, cb) => {
    const uniqueName = `${crypto.randomUUID()}-${Date.now()}.pdf`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadFile = (fieldName = FIELD_NAME) => upload.single(fieldName);

const uploadFiles = (fieldName = FIELD_NAME, maxCount = 5) =>
  upload.array(fieldName, maxCount);

const uploadFields = (fields) =>
  upload.fields(
    fields ?? [
      { name: FIELD_NAME, maxCount: 1 },
    ]
  );

const uploadNone = () => upload.none();

const handleMulterError = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "El archivo no puede superar los 5MB" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: `Campo de archivo inesperado: ${err.field}` });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  return _next();
};

export {
  upload,
  UPLOAD_PATH,
  ALLOWED_MIMETYPES,
  MAX_FILE_SIZE,
  FIELD_NAME,
  uploadFile,
  uploadFiles,
  uploadFields,
  uploadNone,
  handleMulterError,
};
