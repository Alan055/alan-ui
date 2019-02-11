var path = require('path')
var webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const utils = require('./utils') // 引入vue-loader的配置项
const NODE_ENV = process.env.NODE_ENV
const isProduction = NODE_ENV === 'production'
// const sourceMapEnabled = isProduction ?
module.exports = {
  // entry: './src/main.js',
	// 根据不同的执行环境配置不同的入口
	entry:NODE_ENV == 'development' ? './src/main.js' : './src/index.js',
  output: {
	  // 修改打包出口，在最外级目录打包出一个 index.js 文件，我们 import 默认会指向这个文件
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'alan-ui.js',
	  library: 'alan-ui', // 指定的就是你使用require时的模块名
	  libraryTarget: 'umd', // libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的
	  umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // 为了添加全局less变量文件  必须加入这个插件 这个options里面都是新增的
        options: {
          loaders: utils.cssLoaders({
            sourceMap: true,
            extract: isProduction,
          }),
          cssSourceMap: true,
          cacheBusting: true,
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          },
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      // 编译字体文件
      {
        test: /\.(eot|woff|ico|svg|ttf|woff2|gif)(\?|$)/,
        loader: 'file-loader?name=[hash].[ext]'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // 为了添加全局less变量文件  必须加入这个插件
    new ExtractTextPlugin({
      filename: path.posix.join('static', 'css/[name].[contenthash].css'),
      allChunks: true,
    }),
  ])
}
