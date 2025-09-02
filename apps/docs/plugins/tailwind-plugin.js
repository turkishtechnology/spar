function tailwindPlugin() {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins = [require('tailwindcss'), require('autoprefixer')];
      return postcssOptions;
    },
  };
}

module.exports = tailwindPlugin;
