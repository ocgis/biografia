const { environment } = require('@rails/webpacker');

// resolve-url-loader must be used before sass-loader
environment.loaders.get('sass').use.splice(-1, 0, {
  loader: 'resolve-url-loader',
});

const webpack = require('webpack');

environment.plugins.append('Provide', new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  Rails: ['@rails/ujs'],
}));

const aliasConfig = {
  'jquery': 'jquery/src/jquery',
  'jquery-ui': 'jquery-ui-dist/jquery-ui',

};

environment.config.set('resolve.alias', aliasConfig);

module.exports = environment;
