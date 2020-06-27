#!/usr/bin/env node

process.on('unhandledRejection', err => { throw err })

const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')

const root = path.resolve(__dirname, '..')
const buildDir = path.resolve(root, 'build')
const defaultBuildDir = path.resolve(buildDir, 'default')

const build = async () => {
  await transpileJS()
  includeAssets()
  createMozillaVersion()
  console.log('done!')
}

const transpileJS = async () => {
  console.log('transpiling browser extension js...')

  fs.rmdirSync(buildDir, { recursive: true })

  return new Promise((resolve) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) { throw err }

      const msgs = stats.toJson({ all: false, warnings: true, errors: true })
      if (msgs.errors.length) { throw msgs.errors[0] }
      if (msgs.warnings.length) { throw msgs.warnings[0] }

      resolve()
    })
  })
}

// a browser extension is really up to 3 isolated mini-sites,
// so this creates one output per entry point.
const webpackConfig = {
  mode: 'production',
  entry: {
    background: path.resolve(root, 'background/background.js'),
    options: path.resolve(root, 'options/options.js'),
    popup: path.resolve(root, 'popup/popup.js'),
  },
  output: {
    filename: '[name]/[name].js',
    path: defaultBuildDir,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
        },
      },
    ],
  },
}

const includeAssets = () => {
  console.log('adding assets...')

  const paths = [
    path.resolve(root, 'assets'),
    path.resolve(root, 'manifest.json'),
    ...glob.sync(path.resolve(root, '!(build|node_modules)/**/*.{css,html,md}')),
  ]
  paths.forEach((p) => fs.copySync(p, p.replace(root, defaultBuildDir)))
}

const createMozillaVersion = () => {
  // Create a version with adapted manifest for mozilla.
  // This is required so we can save settings, but chromium will
  // whine like a baby about unknown keys if it encounters this.
  // https://developer.mozilla.org/de/docs/Mozilla/Add-ons/WebExtensions/API/storage/sync

  console.log('creating mozilla version...')

  const mozillaBuildDir = path.resolve(buildDir, 'mozilla')
  fs.copySync(defaultBuildDir, mozillaBuildDir)

  const manifestPath = path.resolve(mozillaBuildDir, 'manifest.json')
  const content = JSON.parse(fs.readFileSync(manifestPath).toString())
  content.browser_specific_settings = {
    gecko: {
      id: 'janosch84@gmail.com',
    },
  }
  fs.writeFileSync(manifestPath, JSON.stringify(content, null, 2))
}

build()
