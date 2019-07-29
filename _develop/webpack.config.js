const paths = require('./paths');
const TerserPlugin = require('terser-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const shouldUseSourceMap = false;

const red = '\u001b[31m';
const green = '\u001b[32m';
const reset = '\u001b[0m';

const notice_dev = `
${red}===================================
    Webpack mode:development
    Don't forget ${green}yarn build${red}.
${red}===================================${reset}
`;

module.exports = (env) => {
  process.env.BABEL_ENV = env.NODE_ENV;
  process.env.NODE_ENV = env.NODE_ENV;
  return {
    mode: env.NODE_ENV,
    bail: true,
    devtool: shouldUseSourceMap ? 'source-map' : false,
    entry: {
      bundle: [
        'react-app-polyfill/ie11',
        '@babel/polyfill',
        'intersection-observer',
        'smoothscroll-for-websites',
        'gsap/TweenLite',
        'gsap/CSSPlugin',
        'gsap/ScrollToPlugin',
        './src/js/main.js'
      ]
    },
    output: {
      path: paths.appBuild,
      publicPath: '/' + paths.subDirectory,
      filename: 'assets/js/[name].js',
      chunkFilename: 'assets/js/[name].js'
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              arrows: false
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          parallel: true,
          cache: true,
          sourceMap: shouldUseSourceMap
        })
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            filename: 'assets/js/vendor.js',
            chunks: 'initial',
            enforce: true
          }
        }
      },
      runtimeChunk: false
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.(js|mjs|jsx)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                eslintPath: require.resolve('eslint')
              },
              loader: require.resolve('eslint-loader')
            }
          ],
          include: paths.appSrc
        },
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: ['raw-loader', 'glslify-loader']
        },
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'assets/media/[name].[hash:8].[ext]'
              }
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'
                        }
                      }
                    }
                  ]
                ],
                cacheDirectory: true,
                cacheCompression: true,
                compact: true
              }
            },
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [require.resolve('babel-preset-react-app/dependencies'), { helpers: true }]
                ],
                cacheDirectory: true,
                cacheCompression: true,
                sourceMaps: false
              }
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'assets/media/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin({
        clearConsole: true
      }),
      new EventHooksPlugin({
        done: () => {
          console.log(notice_dev);
        }
      })
    ],
    performance: false
  };
};
