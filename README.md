# grunt-gd-spriter

>Create sprites from css images according their position, repeating, and replace them in the css.

## Getting Started
This plugin requires Grunt `~0.4.1`

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
    },
  },
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
  },
})
```

#### Custom Options

```js
grunt.initConfig({
  spriter: {
    options: {
        spaceVertical: 2,
        spaceHorizontal: 2
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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Copyright

Copyright (c) 2013, GoodData Corporation (BSD License)