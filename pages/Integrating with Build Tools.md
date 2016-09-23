# Browserify

### Установка

```sh
npm install tsify
```

### Использование интерфейса командной строки

```sh
browserify main.ts -p [ tsify --noImplicitAny ] > bundle.js
```

### Использование API

```js
var browserify = require("browserify");
var tsify = require("tsify");

browserify()
    .add("main.ts")
    .plugin("tsify", { noImplicitAny: true })
    .bundle()
    .pipe(process.stdout);
```

Больше информации: [smrq/tsify](https://github.com/smrq/tsify)

# Duo

### Установка

```sh
npm install duo-typescript
```

### Использование интерфейса командной строки

```sh
duo --use duo-typescript entry.ts
```

### Использование API

```js
var Duo = require("duo");
var fs = require("fs")
var path = require("path")
var typescript = require("duo-typescript");

var out = path.join(__dirname, "output.js")

Duo(__dirname)
    .entry("entry.ts")
    .use(typescript())
    .run(function (err, results) {
        if (err) throw err;
        // Записать результат компиляции в файл
        fs.writeFileSync(out, results.code);
    });
```

Больше информации: [frankwallis/duo-typescript](https://github.com/frankwallis/duo-typescript)

# Grunt

### Установка

```sh
npm install grunt-ts
```

### Базовый Gruntfile.js

````js
module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default : {
                src: ["**/*.ts", "!node_modules/**/*.ts"]
            }
        }
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts"]);
};
````
Больше информации: [TypeStrong/grunt-ts](https://github.com/TypeStrong/grunt-ts)

# gulp

### Установка

```sh
npm install gulp-typescript
```

### Базовый gulpfile.js

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");

gulp.task("default", function () {
    var tsResult = gulp.src("src/*.ts")
        .pipe(ts({
              noImplicitAny: true,
              out: "output.js"
        }));
    return tsResult.js.pipe(gulp.dest("built/local"));
});
```

Больше информации: [ivogabe/gulp-typescript](https://github.com/ivogabe/gulp-typescript)

# jspm

### Установка

```sh
npm install -g jspm@beta
```

_Замечание: На данный момент поддержка TypeScript в jspm есть в версии 0.16beta_

Больше информации: [TypeScriptSamples/jspm](https://github.com/Microsoft/TypeScriptSamples/tree/master/jspm)

# webpack

### Установка

```sh
npm install ts-loader --save-dev
```

### Базовый webpack.config.js

```js
module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js"
    },
    resolve: {
        // Добавить расширения '.ts' и '.tsx' в список разрешаемых
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // все файлы с расширениями 'ts' или '.tsx' будет обрабатывать `ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
}
```

См. [больше информации о ts-loader](https://www.npmjs.com/package/ts-loader).

Альтернативы:

* [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader)

# MSBuild

Обновите файл файл проекта, включив установленные локально файлы `Microsoft.TypeScript.Default.props` (в начале файла) и `Microsoft.TypeScript.targets` (в конце файла).

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <!-- Добавить свойства по умолчанию ниже -->
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props')" />

  <!-- TypeScript configurations go here -->
  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)' == 'Release'">
    <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
    <TypeScriptSourceMap>false</TypeScriptSourceMap>
  </PropertyGroup>

  <!-- Добавить цели по умолчанию ниже -->
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
</Project>
```

Больше информации об указании опций компилятора MSBuild: [Установка опций компилятора в проектах MSBuild](./Compiler Options in MSBuild.md)

# NuGet

* Щелкнуть правой кнопкой -> Управление пакетами NuGet (`Manage NuGet Packages`)
* Найти `Microsoft.TypeScript.MSBuild`
* Нажать `Установить` (`Install`)
* Когда установка закончится, пересобрать проект!

Больше информации: [Управление пакетами](http://docs.nuget.org/Consume/Package-Manager-Dialog) и [Использование ночных сборок с NuGet](https://github.com/Microsoft/TypeScript/wiki/Nightly-drops#using-nuget-with-msbuild)
