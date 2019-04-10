const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const del = require('del');
const rename = require('gulp-rename');
const size = require('image-size');
const sharp = require('sharp');
const through2 = require('through2');

const path = require('path');
const fs = require('fs');
const util = require('util');

const paths = {
  images: 'images/',
  uploads: 'uploads/*.{jpg,jpeg,png,webp}'
};

let watcher = gulp.watch(paths.uploads);
watcher.on('all', async (event, file, stats) => {
  if (event == 'unlink') return;
  let name = path.basename(file)
  let ext = path.extname(file);

  let { width, height } = size(file);
  let aspectRatio = width / height;

  let newSize = 256;
  let resizeFuncs = [];

  while (newSize < width && newSize / aspectRatio < height) {
    resizeFuncs.push(
      resizeImage(file, name, ext, newSize, newSize / aspectRatio)
    );
    newSize = newSize * 2;
  }

  gulp.series(
    ...resizeFuncs,
    cb => {
      let stream = gulp
        .src(file)
        .pipe(
          imagemin([mozjpeg({ quality: 50 }), pngquant({ quality: [0.65, 0.8] })])
        )
        .pipe(rename(`base${ext}`))
        .pipe(gulp.dest(path.join(paths.images, name)));
      stream.on('end', cb);
    },
    () => del(file)
  )();
});

function resizeImage(file, name, ext, width, height) {
  return cb => {
    let stream = gulp
      .src(file)
      .pipe(rename(`${width}${ext}`))
      .pipe(
        through2.obj(function(file, _, cb) {
          sharp(file.contents)
            .resize(width, Math.round(height))
            .toBuffer()
            .then(buffer => {
              file.contents = buffer;
              cb(null, file);
            })
            .catch(err => {
              console.error(err);
              cb(null, file);
            });
        })
      )
      .pipe(
        imagemin([mozjpeg({ quality: 70 }), pngquant({ quality: [0.65, 0.8] })])
      )
      .pipe(gulp.dest(path.join(paths.images, name)));
    stream.on('end', cb);
  };
}
