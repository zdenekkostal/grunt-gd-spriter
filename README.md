# grunt-gd-spriter

>Create sprites from css images according their position, repeating, and replace them in the css.

## Getting Started
This plugin requires Grunt `~0.4.1` and gd library. See [node-gd readme](https://npmjs.org/package/node-gd#readme) for more info.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gd-spriter --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gd-spriter');
```

## The "spriter" task

### Overview
In your project's Gruntfile, add a section named `spriter` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  spriter: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
})
```

### Options

#### options.spaceVertical
Type: `Number`
Default value: `0`

Space between images in sprite (in `px`)

#### options.spaceHorizontal
Type: `Number`
Default value: `0`

Space between images in sprite (in `px`)

#### options.skip
Type: `Array`
Default value: `[]`

Array of images that should not be sprited.

#### options.version
Type: `String`
Default value: ``

Version string which will be added to the sprite file name.

### Usage Examples

```js
grunt.initConfig({
  spriter: {
    options: {},
    all: {
        src: 'styles/styles.css',
        dest: 'styles/styles-sprited.css',
        spriteDest: 'sprites'
    }
  }
})
```

#### Custom Options

```js
grunt.initConfig({
  spriter: {
    options: {
        spaceVertical: 2,
        spaceHorizontal: 2,
        version: '43a2e0'
    },
    all: {
        src: 'styles/styles.css',
        dest: 'styles/all-sprited.css',
        spriteDest: 'sprites'
    },
    multiple: {
        src: ['styles/buttons.css', 'styles/forms.css'],
        dest: 'styles/all-sprited.css',
        spriteDest: 'images/sprites'
    }
  },
})
```

#### Sprite all files in folder

See ["Building the files object dynamically"](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for more information.

```js
grunt.initConfig({
  spriter: {
      options: {
          spriteDest: 'dist/images/sprites',
          skip: [
              '../images/bigImage.png'
          ]
      },
      all: {
          files: [
              {
                  expand: true,        // Enable dynamic expansion.
                  cwd: 'src/styles',   // Src matches are relative to this path.
                  src: ['*.css'],      // Actual pattern(s) to match.
                  dest: 'dist/styles', // Destination path prefix.
                  ext: '.sprited.css'  // Dest filepaths will have this extension.
              }
          ]
      }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Copyright

Copyright (c) 2013, GoodData Corporation (BSD License)