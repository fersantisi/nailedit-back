import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectId = req.params.projectId;
    const dir = path.join(__dirname, '../../uploads/projects', projectId);

    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });