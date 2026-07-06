const fs = require('fs');
const path = require('path');
const { UPLOAD_PATH, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } = require('../utils/constants');
const Logger = require('../utils/logger');

const uploadPath = path.join(process.cwd(), UPLOAD_PATH);
const metadataPath = path.join(uploadPath, '.metadata.json');

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
      const metadata = this._loadMetadata();
      const files = fs.readdirSync(uploadPath).filter(f => f !== '.metadata.json');
      return files.map(file => {
        const meta = metadata[file] || {};
        return {
          name: file,
          alt: meta.alt || '',
          url: `/uploads/${file}`,
          markdownPath: `![${meta.alt || file}](/uploads/${file})`,
          path: path.join(uploadPath, file),
          size: fs.statSync(path.join(uploadPath, file)).size,
          uploadedAt: fs.statSync(path.join(uploadPath, file)).mtime
        };
      });
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
        alt: '',
        url: `/uploads/${filename}`,
        markdownPath: `![${filename}](/uploads/${filename})`,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      Logger.error('Error uploading file', error);
      throw error;
    }
  }

  updateFile(filename, updates) {
    try {
      const filepath = path.join(uploadPath, filename);
      if (!fs.existsSync(filepath)) {
        throw new Error('File not found');
      }

      const metadata = this._loadMetadata();
      const current = metadata[filename] || { alt: '' };

      if (updates.alt !== undefined) {
        current.alt = updates.alt;
      }

      if (updates.newName && updates.newName !== filename) {
        const ext = path.extname(filename);
        let newName = updates.newName;
        if (!newName.endsWith(ext)) {
          newName = newName + ext;
        }
        const newPath = path.join(uploadPath, newName);
        if (fs.existsSync(newPath)) {
          throw new Error('A file with that name already exists');
        }
        fs.renameSync(filepath, newPath);
        metadata[newName] = current;
        delete metadata[filename];
        this._saveMetadata(metadata);
        return {
          name: newName,
          alt: current.alt,
          url: `/uploads/${newName}`,
          markdownPath: `![${current.alt || newName}](/uploads/${newName})`,
          size: fs.statSync(newPath).size,
          uploadedAt: fs.statSync(newPath).mtime
        };
      }

      metadata[filename] = current;
      this._saveMetadata(metadata);

      return {
        name: filename,
        alt: current.alt,
        url: `/uploads/${filename}`,
        markdownPath: `![${current.alt || filename}](/uploads/${filename})`,
        size: fs.statSync(filepath).size,
        uploadedAt: fs.statSync(filepath).mtime
      };
    } catch (error) {
      Logger.error('Error updating file', error);
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

      const metadata = this._loadMetadata();
      delete metadata[filename];
      this._saveMetadata(metadata);

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

      const metadata = this._loadMetadata();
      const meta = metadata[filename] || {};

      return {
        name: filename,
        alt: meta.alt || '',
        url: `/uploads/${filename}`,
        markdownPath: `![${meta.alt || filename}](/uploads/${filename})`,
        stats: fs.statSync(filepath)
      };
    } catch (error) {
      Logger.error(`Error getting file: ${filename}`, error);
      return null;
    }
  }

  _loadMetadata() {
    try {
      if (fs.existsSync(metadataPath)) {
        return JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      }
    } catch (error) {
      Logger.error('Error loading media metadata', error);
    }
    return {};
  }

  _saveMetadata(metadata) {
    try {
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    } catch (error) {
      Logger.error('Error saving media metadata', error);
    }
  }
}

module.exports = new MediaService();
