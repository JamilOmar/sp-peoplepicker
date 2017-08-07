var webpack = require('webpack');
module.exports ={

    context: __dirname +'/app',
    entry : './index.js',
    output :{
        path : __dirname +'/app',
        filename : 'bundle.js' 
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?sourceMap'
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]


}