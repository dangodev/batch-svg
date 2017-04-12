# Batch SVG

This uses node to take a folder of images (`./src`), and exports them to
`./dist/layout.svg`.

## Setup

[Node.js](https://nodejs.org/en/) is required. Once that’s installed, run

```
npm i
```

to install the required modules (you can also use `yarn`
([yarnpkg.com](https://yarnpkg.com/en/)) instead if you prefer).

## Usage

First, place images in the `./src` folder.

Then, run

```
npm run layout
```

and it will crunch all the images and spit out a `./dist/layout.svg` file.

**Warning: this will overwrite the previous `layout.svg` file.** Be sure to
copy this file elsewhere if you need it for whatever reason.

_Note: this embeds all the images in the SVG file, resulting in pretty hefty
filesizes. This seemed preferrable to simply linking to images, which are
fragile and break easily._
