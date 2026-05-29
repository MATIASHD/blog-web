const fs = require('fs');
const path = require('path');
const { UPLOAD_PATH, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } = require('../utils/constants');
const Logger = require('../utils/logger');

const uploadPath = path.join(process.cwd(), UPLOAD_PATH);

class MediaService {
  constructor() {
    this.ensureUploadDir();
  }

  ensureUploadDir() {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  getAll() {
    try {
      if (!fs.existsSync(uploadPath)) {
        return [];
      }

      const files = fs.readdirSync(uploadPath);
      return files.map(file => ({
        name: file,
        url: `/uploads/${file}`,
        path: path.join(uploadPath, file),
        uploadedAt: fs.statSync(path.join(uploadPath, file)).mtime
      }));
    } catch (error) {
      Logger.error('Error getting media list', error);
      return [];
    }
  }

  uploadFile(file) {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File too large');
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new Error('Invalid file type');
      }

      const filename = `${Date.now()}-${file.originalname}`;
      const filepath = path.join(uploadPath, filename);

      fs.writeFileSync(filepath, file.buffer);

      return {
        name: filename,
        url: `/uploads/${filename}`,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      Logger.error('Error uploading file', error);
      throw error;
    }
  }

  deleteFile(filename) {
    try {
      const filepath = path.join(uploadPath, filename);

      if (!fs.existsSync(filepath)) {
        throw new Error('File not found');
      }

      fs.unlinkSync(filepath);
      return true;
    } catch (error) {
      Logger.error(`Error deleting file: ${filename}`, error);
      throw error;
    }
  }

  getFile(filename) {
    try {
      const filepath = path.join(uploadPath, filename);

      if (!fs.existsSync(filepath)) {
        return null;
      }

      return {
        name: filename,
        url: `/uploads/${filename}`,
        stats: fs.statSync(filepath)
      };
    } catch (error) {
      Logger.error(`Error getting file: ${filename}`, error);
      return null;
    }
  }
}

module.exports = new MediaService();
