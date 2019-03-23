const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = {
    // The source of CKEditor is encapsulated in ES6 modules. By default, the code
    // from the node_modules directory is not transpiled, so you must explicitly tell
    // the CLI tools to transpile JavaScript files in all ckeditor5-* modules.
    transpileDependencies: [
        /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
    ],

    configureWebpack: {
        plugins: [
            // CKEditor needs its own plugin to be built using webpack.
            new CKEditorWebpackPlugin( {
                // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
                language: 'en'
            } )
        ]
    },

    css: {
        loaderOptions: {
            // Various modules in the CKEditor source code import .css files.
            // These files must be transpiled using PostCSS in order to load properly.
            postcss: styles.getPostCssConfig( {
                themeImporter: {
                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                },
                minify: true
            } )
        }
    },

    chainWebpack: config => {
        // Vue CLI would normally use its own loader to load .svg files. The icons used by
        // CKEditor should be loaded using raw-loader instead.

        // Get the default rule for *.svg files.
        const svgRule = config.module.rule( 'svg' );

        // Then you can either:
        //
        // * clear all loaders for existing 'svg' rule:
        //
        //		svgRule.uses.clear();
        //
        // * or exclude ckeditor directory from node_modules:
        svgRule.exclude.add( __dirname + '/node_modules/@ckeditor' );

        // Add an entry for *.svg files belonging to CKEditor. You can either:
        //
        // * modify the existing 'svg' rule:
        //
        //		svgRule.use( 'raw-loader' ).loader( 'raw-loader' );
        //
        // * or add a new one:
        config.module
            .rule( 'cke-svg' )
            .test( /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/ )
            .use( 'raw-loader' )
            .loader( 'raw-loader' );
    }
};