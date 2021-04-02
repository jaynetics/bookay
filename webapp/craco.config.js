module.exports = {
  babel: {
    plugins: [
      // use preact to transform jsx
      ['@babel/plugin-transform-react-jsx', {
        runtime: 'automatic',
        importSource: 'preact',
      }]
    ],
  },
  webpack: {
    // support libs importing from react(-dom)
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    }
  },
}
