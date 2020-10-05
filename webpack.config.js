const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
    mode: 'development',
    target: 'node',
    externals: [nodeExternals()],
    devtool: 'eval-source-map',
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module:{
        rules:[
            {
                test: /\.ts$/,
                use: 'ts-loader' 
            }
        ]
    }

};