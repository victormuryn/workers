module.exports = {
  ident: `postcss`,
  sourceMap: true,
  plugins: [
    require(`autoprefixer`),
    require(`css-mqpacker`),
    // require(`cssnano`)({
    //   svgo: false,
    //   preset: [
    //     `default`, {
    //       discardComments: {
    //         removeAll: true,
    //       },
    //     },
    //   ],
    // }),
  ],
};
