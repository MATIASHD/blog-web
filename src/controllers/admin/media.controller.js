const mediaService = require('../../services/media.service');
const ApiResponse = require('../../utils/response');
const STATUS = require('../../constants/status');

const getMediaList = (req, res, next) => {
  try {
    const media = mediaService.getAll();
    res.render('pages/media', {
      title: 'Media Manager',
      media
    });
  } catch (error) {
    next(error);
  }
};

const uploadMedia = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(STATUS.BAD_REQUEST).json({
        success: false,
        message: 'No file provided'
      });
    }

    const uploaded = mediaService.uploadFile(req.file);
    res.status(STATUS.CREATED).json({
      success: true,
      message: 'File uploaded successfully',
      data: uploaded
    });
  } catch (error) {
    res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

const deleteMedia = (req, res, next) => {
  try {
    mediaService.deleteFile(req.params.filename);
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(STATUS.NOT_FOUND).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getMediaList,
  uploadMedia,
  deleteMedia
};