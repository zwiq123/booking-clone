import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "public/uploads";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req: Request, file: File, callback) => {
        callback(null, uploadDir)
    },
    filename: (req: Request, file: File, callback) => {
        const suffix = Date.now() + "-" + Math.round(Math.random() * 99999999)
        callback(null, file.fieldname + "-" + suffix + path.extname(file.originalname))
    }
})

export const upload = multer({storage, limits: {fileSize: 5 * 1024 * 1024}});