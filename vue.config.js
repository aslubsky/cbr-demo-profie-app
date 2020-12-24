// vue.config.js
module.exports = {
    runtimeCompiler: true,
    publicPath: '',
    devServer: {
        proxy: {
            '^/api': {
                target: 'https://qa.davintoo.com',
                ws: true,
                changeOrigin: true
            }
        },
        watchOptions: {
            clientLogLevel: 'warning'
        }
    }
}
