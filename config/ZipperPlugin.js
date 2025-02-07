const path = require("path")
const AdmZip = require("adm-zip")

// get the name of the base directory
let projectName = path.basename(path.resolve('.'))

// replace spaces with underscores
projectName = projectName.replace(/\s/g, '-')

// lowercase the name
projectName = projectName.toLowerCase()

// replace characters with URL compatible ones
projectName = encodeURIComponent(projectName)

const defaultOptions = {
  outputPath: path.resolve(__dirname, `../dist-zipped/${projectName}.zip`)
}

/**
 * The zipper plugin hooks to the end of compilation event, and it creates a ZIP file of
 * all the files within the ./dist folder into the ./dist-zipped folder to create a file
 * ready to be deployed on fxhash.
 * https://webpack.js.org/contribute/writing-a-plugin/
 */
class ZipperPlugin {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    }
  }

  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.done.tapAsync(
      "ZipperPlugin",
      (stats, callback) => {
        const outputPath = stats.compilation.outputOptions.path
        const zip = new AdmZip()
        zip.addLocalFolder(outputPath)
        zip.toBuffer()
        zip.writeZip(this.options.outputPath)
        callback()
      }
    )
  }
}

module.exports = ZipperPlugin