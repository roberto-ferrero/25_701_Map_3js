const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const portFinderSync = require('portfinder-sync')

const infoColor = (_message) => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
    commonConfiguration,
    {
        stats: 'errors-warnings',
        mode: 'development',
        
        // --- ADD THIS FOR DEV ---
        output: {
            publicPath: '/', // Forces dev server to serve from root
            library: {
                name: 'PandoraMap',
                type: 'window', // Simple assignment to window.PandoraMap
                export: 'default',
            }
        },
        // ------------------------

        infrastructureLogging: {
            level: 'warn',
        },
        devServer: {
            host: 'local-ip',
            port: portFinderSync.getPort(8080),
            open: true,
            https: false,
            allowedHosts: 'all',
            hot: true, // Try setting this to true for better dev experience
            watchFiles: ['src/**', 'static/**'],
            static: {
                watch: true,
                directory: path.join(__dirname, '../static')
            },
            client: {
                logging: 'none',
                overlay: true,
                progress: false
            },
            setupMiddlewares: function (middlewares, devServer) {
                // ... (Keep your existing middleware logic) ...
                console.log('------------------------------------------------------------')
                console.log(devServer.options.host)
                const port = devServer.options.port
                const https = devServer.options.https ? 's' : ''
                const domain1 = `http${https}://${devServer.options.host}:${port}`
                const domain2 = `http${https}://localhost:${port}`
                console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
                return middlewares
            }
        }
    }
)