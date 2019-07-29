const fs = require('fs');
const cpx = require('cpx');
const path = require('path');
const paths = require('../paths');
var green = '\u001b[32m';
var reset = '\u001b[0m';

var fsw;
if (process.platform.includes('win32')) {
  fsw = fs.watchFile(
    'src/images/',
    {
      persistent: true,
      recursive: true
    },
    function(type, filename) {
      cpx.copy(`${paths.appSrc}images/**/*`, `${paths.appBuild}/assets/images`, { clean: true }, function() {
        console.log(`${green}change : ${reset}${filename} : ${green}done.${reset}`);
      });
    }
  );
} else {
  fsw = fs.watch(
    `${paths.appSrc}images/`,
    {
      persistent: true,
      recursive: true
    },
    function(type, filename) {
      const filePath = filename
        .split('/')
        .reverse()
        .slice(1)
        .reverse()
        .join('/');
      cpx.copy(`${paths.appSrc}images/` + filename, `${paths.appBuild}/assets/images/${filePath}`, { clean: true }, function() {
        console.log(`${green}change : ${reset}${filename} : ${green}done.${reset}`);
      });
    }
  );
}
