/**
 * Gulpfile
 * Handy task-runner
 */

/**
 * @section Dependencies
 */

const fs = require('fs');
const path = require('path');

const Datauri = require('datauri');
const glob = require('glob');
const imageSize = require('image-size');
const nunjucks = require('nunjucks');

/**
 * @section Settings
 */

const columns = 12;            // Number of columns
const dpi = 72;                // Divide pixels by this (this effectively does nothing other than make Illustrator happy)

/**
 * @section Helpers
 */

const datauri = new Datauri(); // Allow DataURI to use the buffer for 🚀 speed

function layout () {

  // 1. Get all files in ./src folder matching the following extensions

  glob('./src/**/*.{jpg,jpeg,gif,png}', (err, files) => {

    // 2. Calculate widths, heights, and image data of all images using the ImageSize library.

    let images = files.map(fileName => { // map() loops through an array and modifies it (we’re changing “images” here)
      let file = fs.readFileSync(path.join(__dirname, fileName)); // Reads image data
      return {
        height: imageSize(file).height / dpi, // We divide by DPI to keep the artboard small, only for Illustrator
        src: datauri.format(path.extname(fileName), file).content, // Base64 is required to embed images in SVG
        width: imageSize(file).width / dpi,
      };
    });

    // 3. Lay out grid (can only be done once heights & widths are known)

    let columnWidth = [];      // Placeholder array of column widths
    let rowHeight = [];        // Placeholder array of row heights

    images.forEach((image, index) => {       // We use forEach() instead of map() here b/c we’re not modifying “images”
      let currentColumn = index % columns;          // Get current column, starting from 0
      let currentRow = Math.floor(index / columns); // Get current row, starting from 0

      // If this image is wider than its column, then make the column wider
      if (!columnWidth[currentColumn] || columnWidth[currentColumn] < image.width) {
        columnWidth[currentColumn] = image.width;
      }
      // If this image is taller than its row, then make the row taller
      if (!rowHeight[currentRow] || rowHeight[currentRow] < image.height) {
        rowHeight[currentRow] = image.height;
      }
    });

    // 4. Get total artboard size

    let viewBoxWidth = columnWidth.reduce((a, b) => a + b); // reduce() is a fancy way to add an array of numbers together
    let viewBoxHeight = rowHeight.reduce((a, b) => a + b);

    // 4. Align images on grid

    images.map((image, index) => {
      let currentRow = Math.floor(index / columns);  // Same code as above; we need it here, too
      let currentColumn = index % columns;

      // The following math looks hard, but it’s just adding up values from the column/row array.
      let x = currentColumn === 0 ? -viewBoxWidth / 2 : columnWidth.slice(0, currentColumn).reduce((a, b) => a + b) - viewBoxWidth / 2;
      let y = currentRow === 0 ? -viewBoxHeight / 2 : rowHeight.slice(0, currentRow).reduce((a, b) => a + b) - viewBoxHeight / 2;

      return Object.assign(image, { x, y });   // ES6 shorthand; same as setting { x: x, y: y }
    });

    // 5. Write to SVG file

    fs.writeFileSync(
      path.join(__dirname, './dist/layout.svg'),
      nunjucks.render('./lib/template.svg', {  // Nunjucks lets us use our `template.svg` file
        images,                                // An array of everything we’ve done
        viewBox: `-${viewBoxWidth / 2} -${viewBoxHeight / 2} ${viewBoxWidth} ${viewBoxHeight}`, // Artboard measurements
      })
    );

    console.log('Done!'); // 🎉
  });
}

layout();
