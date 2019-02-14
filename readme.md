![](https://echorial.com/Images/Carbonite.png)

![https://www.echorial.com](https://img.shields.io/badge/carbon-v1.0-blue.svg?label=carbon&colorB=2e3d6b&style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Echorial/carbonite.svg?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Echorial/carbonite.svg?style=flat-square)
![license](https://img.shields.io/github/license/Echorial/carbonite.svg?style=flat-square)

Carbonite is a full carbon compiler written in carbon.

## Command-Line
```
$ npm install carbonite-cli
```
## Library
```
$ npm install carbonite
```

## Building
```
$ carbonite pipe Project/javascript.pipeline output="dist/module.js"
```

### Building the carbon parser
```
$ carpeg generate src/parser/Carbon.cpeg src/parser/carbon.carb --name="CarboniteCarbonParser"
```

## Development with carbonite-cli
carbonite/
```
$ npm link
```
carbonite-cli/
```
$ npm link carbonite
```
Now when rebuilding carbonite the cli will be using the new carbonite build.

Coming soon
```
$ carbonite dev /absolute/path/to/carbonite.js
```
## Platform support
![https://www.echorial.com](https://img.shields.io/badge/php-limited-orange.svg?style=flat-square)
![https://www.echorial.com](https://img.shields.io/badge/javascript-full-green.svg?style=flat-square)