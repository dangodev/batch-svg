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

const columns = 12;    // Columns
const dpi = 72;        // Divide pixels by this

/**
 * @section Helpers
 */

const datauri = new Datauri();

function layout () {

  // 1. Get all files in ./src folder

  glob('./src/**/*.{jpg, jpeg, gif, png}', (err, files) => {

    // 2. Calculate widths/heights of all images

    let images = files.map(fileName => {
      let file = fs.readFileSync(path.join(__dirname, fileName));
      return {
        height: imageSize(file).height / dpi,
        src: datauri.format(path.extname(fileName), file).content,
        width: imageSize(file).width / dpi,
      };
    });

    // 3. Lay out grid (can only be done once heights & widths are known)

    let rowHeight = [];
    let columnWidth = [];

    images.forEach((image, index) => {
      let currentRow = Math.floor(index / columns);
      let currentColumn = index % columns;

      if (!columnWidth[currentColumn] || columnWidth[currentColumn] < image.width) {
        columnWidth[currentColumn] = image.width;
      }
      if (!rowHeight[currentRow] || rowHeight[currentRow] < image.height) {
        rowHeight[currentRow] = image.height;
      }
    });

    // 4. Get total artboard size

    let viewBoxWidth = columnWidth.reduce((a, b) => a + b);
    let viewBoxHeight = rowHeight.reduce((a, b) => a + b);

    // 4. Align images on grid

    images.map((image, index) => {
      let currentRow = Math.floor(index / columns);
      let currentColumn = index % columns;

      let x = currentColumn === 0 ? -viewBoxWidth / 2 : columnWidth.slice(0, currentColumn).reduce((a, b) => a + b) - viewBoxWidth / 2;
      let y = currentRow === 0 ? -viewBoxHeight / 2 : rowHeight.slice(0, currentRow).reduce((a, b) => a + b) - viewBoxHeight / 2;

      return Object.assign(image, { x, y });
    });

    // 5. Write to SVG file

    fs.writeFileSync(
      path.join(__dirname, './dist/layout.svg'),
      nunjucks.render('./lib/template.svg', {
        images: images,
        viewBox: `-${viewBoxWidth / 2} -${viewBoxHeight / 2} ${viewBoxWidth} ${viewBoxHeight}`,
      })
    );
    console.log('Done!');
  });
}

layout();
