const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
// ... other imports ...

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        // ... optimization settings ...
        
        // --- THIS RESTORES THE CLIENT REQUIREMENT ---
        output: {
            publicPath: './', // Relative paths for portability
            library: {
                name: 'PandoraMap',
                type: 'umd',        // Universal Module Definition
                export: 'default',
            },
            globalObject: 'this'
        }
        // --------------------------------------------
    }
)