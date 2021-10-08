// vue.config.js
module.exports = {
    runtimeCompiler: true,
    publicPath: '',
    devServer: {
        proxy: {
            '^/api': {
                target: 'https://demotour.davintoo.com',
                ws: true,
                changeOrigin: true
            }
        },
        watchOptions: {
            clientLogLevel: 'warning'
        }
    }
}
