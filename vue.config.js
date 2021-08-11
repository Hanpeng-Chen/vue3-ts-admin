'use strict'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const resolve = dir => path.join(__dirname, dir)

function chainWebpack(config) {
  // set svg-sprite-loader
  config.module
    .rule('svg') // 在已有的svg loader配置中 排除掉对src/icons里svg进行转换
    .exclude.add(resolve('src/icons'))
    .end()
  config.module
    .rule('icons')
    .test(/\.svg$/)
    .include.add(resolve('src/icons'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]'
    })
    .end()
}

module.exports = {
  chainWebpack,
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/dev-api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/dev-api': '/api'
        }
      }
    }
  }
}
