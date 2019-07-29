const fs = require('fs');
const cpx = require('cpx');
const paths = require('../paths');
var green = '\u001b[32m';
var reset = '\u001b[0m';

cpx.copy(
  'src/images/**/*',
  `../public_html/${paths.subDirectory}assets/images`,
  {
    clean: true
  },
  function() {
    console.log('\nimage copy complete.');
  }
);
