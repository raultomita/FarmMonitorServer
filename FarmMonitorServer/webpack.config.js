const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./src/index.tsx",
        //,
        //vendor: [
        //    './node_modules/react/dist/react.js',
        //    './node_modules/react-dom/dist/react-dom.js',
        //    './node_modules/jquery/dist/jquery.min.js',
        //    './node_modules/bootstrap/dist/js/bootstrap.min.js']
       
    output: {
        filename: "bundle.js",
        path: __dirname + "/wwwroot"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    watch: false,
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias: {
            'react': 'node_modules/react/dist/react.js'           
        },
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ],

    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};