require('dotenv').config();
const { NODE_ENV } = process.env;

const windows = {
  mainWindow: null,
  mainWindow: null,
};

const utils = {
  isMacOS: process.platform === 'darwin',
  isProd: NODE_ENV === 'production',
};

module.exports = {
  windows,
  utils,
};
