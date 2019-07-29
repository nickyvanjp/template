const path = require('path');

// サブディレクトリが有る場合指定。最初に/は要らない
// 例）spacial/
const subDirectory = '';

module.exports = {
  appBuild: path.resolve(`../public_html/${subDirectory}`),
  appSrc: path.resolve('src') + '/',
  subDirectory: subDirectory
};
