const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const paths = require('./paths');
const baseFontSize = 16; //-  rem計算用
const spDesignWidth = 768; //-  vw計算用
const pcDesignWidth = 1280; //-  vw風にpc計算する用

var red = '\u001b[31m';
var green = '\u001b[32m';
var reset = '\u001b[0m';

const readImageSize = function(imagePath) {
  let targetPath = imagePath
    .replace(/["']/g, '')
    .replace(/\.\.\//g, '')
    .replace(/^\//i, '');
  targetPath = path.resolve(process.cwd() + '/src/', targetPath);

  let isError = false;
  try {
    fs.readFileSync(targetPath);
  } catch (e) {
    isError = true;
  }
  return new Promise(function(resolve, reject) {
    if (!isError) {
      sizeOf(targetPath, function(err, dimensions) {
        resolve({
          width: dimensions.width,
          height: dimensions.height
        });
      });
    } else {
      reject(imagePath);
    }
  });
};

module.exports = (ctx) => ({
  map:
    ctx.env === 'development'
      ? {
          inline: true
        }
      : false,
  parser: ctx.file.extname === '.sss' ? 'sugarss' : false,
  plugins: [
    require('postcss-import')(),
    require('stylelint')(),
    require('postcss-normalize')(),
    require('postcss-for'),
    require('postcss-flexbugs-fixes')(),
    require('postcss-extend-rule')(),
    require('postcss-mixins')(),
    require('postcss-nested')(),
    require('postcss-simple-vars')(),
    require('postcss-custom-media')(),
    require('postcss-center')(),
    require('postcss-functions')({
      functions: {
        rem: function(num) {
          return `${num / baseFontSize}rem`;
        },
        pw: function(num) {
          return `${(num / (pcDesignWidth + 20)) * 100}vw`;
        },
        vw: function(num) {
          return `${(num / spDesignWidth) * 100}vw`;
        },
        width: function(imagePath) {
          return readImageSize(imagePath)
            .then(function(result) {
              return `${result.width}px`;
            })
            .catch(function(imagePath) {
              console.error(`${red}\n\n\n!!!!!!!! ${green}${imagePath} ${red}: NOT FOUND !!!!!!!!\n\n\n${reset}`);
            });
        },
        widthV: function(imagePath) {
          return readImageSize(imagePath)
            .then(function(result) {
              return `${(result.width / spDesignWidth) * 100}vw`;
            })
            .catch(function() {
              console.error(`${red}\n\n\n!!!!!!!! ${green}${imagePath} ${red}: NOT FOUND !!!!!!!!\n\n\n${reset}`);
            });
        },
        height: function(imagePath) {
          return readImageSize(imagePath)
            .then(function(result) {
              return `${result.height}px`;
            })
            .catch(function() {
              console.error(`${red}\n\n\n!!!!!!!! ${green}${imagePath} ${red}: NOT FOUND !!!!!!!!\n\n\n${reset}`);
            });
        },
        heightV: function(imagePath) {
          return readImageSize(imagePath)
            .then(function(result) {
              return `${(result.height / spDesignWidth) * 100}vw`;
            })
            .catch(function() {
              console.error(`${red}\n\n\n!!!!!!!! ${green}${imagePath} ${red}: NOT FOUND !!!!!!!!\n\n\n${reset}`);
            });
        },
        aspect: function(imagePath) {
          return readImageSize(imagePath)
            .then(function(result) {
              return `${(result.height / result.width) * 100}%`;
            })
            .catch(function() {
              console.error(`${red}\n\n\n!!!!!!!! ${green}${imagePath} ${red}: NOT FOUND !!!!!!!!\n\n\n${reset}`);
            });
        }
      }
    }),
    require('postcss-will-change-transition')(),
    require('css-mqpacker')(),
    require('css-declaration-sorter')({
      order: 'smacss'
    }),
    require('autoprefixer')({
      flexbox: true,
      grid: true
    }),
    require('postcss-cachebuster')({
      type: 'checksum',
      imagesPath: `./../public_html/${paths.subDirectory}`
    }),
    require('postcss-reporter')({
      clearReportedMessages: true
    })
  ].concat(ctx.env === 'development' ? [] : [require('csswring')()])
});
