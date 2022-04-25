/* eslint-disable */
const InjectSeoPlugin = require('@kibalabs/build/scripts/plugins/injectSeoPlugin');

const title = 'MDTP Gallery';
const description = '';
const url = 'https://gallery.milliondollartokenpage.com'
const imageUrl = `${url}/assets/banner.png`;

const seoTags = [
  new InjectSeoPlugin.MetaTag('description', description),
  new InjectSeoPlugin.Tag('meta', {property: 'og:title', content: title}),
  new InjectSeoPlugin.Tag('meta', {property: 'og:description', content: description}),
  new InjectSeoPlugin.Tag('meta', {property: 'og:image', content: imageUrl}),
  new InjectSeoPlugin.Tag('meta', {property: 'og:url', content: url}),
  new InjectSeoPlugin.MetaTag('twitter:card', 'summary_large_image'),
  new InjectSeoPlugin.MetaTag('twitter:site', '@mdtp_app'),
  new InjectSeoPlugin.Tag('link', {rel: 'canonical', href: url}),
  new InjectSeoPlugin.Tag('link', {rel: 'icon', type: 'image/png', href: '/assets/icon.png'}),
];

module.exports = (config) => {
  config.seoTags = seoTags;
  config.title = title;
  config.pages = [{
    path: '/',
    filename: 'index.html',
  }];
  return config;
};
