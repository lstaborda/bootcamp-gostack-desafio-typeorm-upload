import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: csvFilePath,

  storage: multer.diskStorage({
    destination: csvFilePath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
