var util = require('gulp-util');

var production = util.env.production || util.env.prod || false;
var destPath = './';

var config = {
  env       : 'development',
  production: production,

  src: {
    root         : './',
    sass         : './sass',
    sassGen      : './sass/generated',
    js           : './js',
    img          : './img',
    icons        : './icons',
    iconsPng     : './icons'
  },
  dest: {
    root  : destPath,
    css   : destPath + '/css',
    js    : destPath + '/js',
    img   : destPath + '/img'
  },

  setEnv: function(env) {
    if (typeof env !== 'string') return;
    this.env = env;
    this.production = env === 'production';
    process.env.NODE_ENV = env;
  },

  logEnv: function() {
    util.log(
      'Environment:',
      util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
    );
  },

  errorHandler: require('./util/errors')
};

config.setEnv(production ? 'production' : 'development');

module.exports = config;
