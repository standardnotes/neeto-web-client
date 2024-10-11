/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * And for svg files usage
 * https://stackoverflow.com/a/65231261/2504429
 * @format
 */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

const extraNodeModules = {
  common: path.resolve(__dirname + '../..'),
}

const defaultConfig = getDefaultConfig(__dirname)

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [path.resolve(__dirname, '../snjs')],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
    extraNodeModules: new Proxy(extraNodeModules, {
      get: (target, name) => {
        const result = name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`)
        return result
      },
    }),
  },
}

module.exports = mergeConfig(defaultConfig, config)
