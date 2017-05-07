Это руководство научит собирать проекты TypeScript с помощью [gulp](http://gulpjs.com), и использовать [Browserify](http://browserify.org), [uglify](http://lisperator.net/uglifyjs/) или [Watchify](https://github.com/substack/watchify) в связке с gulp.

Предполагается, что вы уже используете [Node.js](https://nodejs.org/) и [npm](https://www.npmjs.com/).

# Минимальный проект

Начнем с создания новой папки.
Мы назовем ее `proj`, однако ей можно дать любое необходимое имя.

```shell
mkdir proj
cd proj
```

Структура проекта будет следующей:

```text
proj/
    +- src/
    +- dist/
```

Файлы TypeScript будут находиться в папке `src`, компилироваться с помощью TypeScript, а результат выводиться в `dist`.

Давайте создадим эту структуру:

```shell
mkdir src
mkdir dist
```

## Инициализация проекта

Превратим эту папку в npm-пакет.

```shell
npm init
```

Вам зададут несколько вопросов.
Для всех можно использовать вариант ответа по умолчанию, кроме вопроса о точке входа (`entry point:`).
В качестве точки входа введите `./dist/main.js`.
Вы всегда можете вернуться и изменить все, что указали, в сгенерированном файле `package.json`.

## Установка зависимостей

Теперь используем `npm install`, чтобы установить пакеты.
В первую очередь глобально установите TypeScript и gulp.
(Если вы пользуетесь Unix-системой, то, возможно, команды `npm install` придется запускать через `sudo`).

```shell
npm install -g typescript gulp-cli
```

Затем установите `gulp` и `gulp-typescript` в качестве зависимостей времени разработки.
[Gulp-typescript](https://www.npmjs.com/package/gulp-typescript) — это плагин к gulp для поддержки TypeScript.

```shell
npm install --save-dev gulp gulp-typescript
```

## Создание простого примера

Давайте напишем несложную программу.
Создайте файл `main.ts` в папке `src`:

```ts
function hello(compiler: string) {
    console.log(`Привет от ${compiler}`);
}
hello("TypeScript");
```

Создайте файл `tsconfig.json` в корне проекта `proj`:

```json
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

## Создание `gulpfile.js`

Создайте файл `gulpfile.js` в корне проекта:

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("dist"));
});
```

## Тестирование полученного приложения

```shell
gulp
node dist/main.js
```

Приложение должно вывести в консоль "Привет от TypeScript!".

# Добавление модулей

Прежде чем добраться до Browserify, соберем код и добавим к нему модули.
Следующую структуру вы, скорее всего, будете использовать и для настоящих приложений.

Создайте файл `src/greet.ts`:

```ts
export function sayHello(name: string) {
    return `Привет от ${name}`;
}
```

Теперь измените код в `src/main.ts` так, чтобы `sayHello` импортировалась из `greet.ts`:

```ts
import { sayHello } from "./greet";

console.log(sayHello("TypeScript"));
```

И, наконец, добавьте `src/greet.ts` в `tsconfig.json`:

```json
{
    "files": [
        "src/main.ts",
        "src/greet.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

Убедитесь, что модули работают, запустив `gulp` и проверив работу кода в Node:

```shell
gulp
node dist/main.js
```

Обратите внимание, что хотя мы применили синтаксис модулей из ES2015, TypeScript создал модули CommonJS, которые используются в Node.
Для целей этого руководства формат CommonJS вполне подходит, но вы можете установить параметр `module` на объекте настроек, чтобы выбрать формат модулей.

# Browserify

Теперь перенесем проект с Node в браузер.
Для этого пришлось бы упаковать все модули в один JavaScript-файл.
К счастью, именно это и делает Browserify.
Больше того, Browserify позволяет использовать модульную систему CommonJS, которая применяется в Node, и модули для которой по умолчанию создает TypeScript.
Это значит, что вносить много изменений в уже настроенную связку TypeScript и Node не потребуется.

Сначала установите browserify, [tsify](https://www.npmjs.com/package/tsify), и vinyl-source-stream.
tsify это плагин для Browserify, который, подобно gulp-typescript, предоставляет доступ к компилятору TypeScript.
vinyl-source-stream позволяет согласовать файловый вывод Browserify и формат под названием [vinyl](https://github.com/gulpjs/vinyl), который понимает gulp.

```shell
npm install --save-dev browserify tsify vinyl-source-stream
```

## Создание страницы

Создайте файл `index.html` в `src`:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Привет, мир!</title>
    </head>
    <body>
        <p id="greeting">Загрузка ...</p>
        <script src="bundle.js"></script>
    </body>
</html>
```

Теперь измените `main.ts`, чтобы обновить страницу:

```ts
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
```

При вызове `showHello` вызывается `sayHello`, которая изменяет текст параграфа.
Теперь замените код в `gulpfile.js` на следующий:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var paths = {
    pages: ['src/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
});
```

Здесь создается задача `copy-html`, которая затем добавляется как зависимость для `default`.
Это значит, что при каждом запуске `default` сначала будет вызываться `copy-html`.
Кроме того, задача `default` была изменена так, что вместо gulp-typescript теперь вызывается Browserify с плагином tsify.
К счастью, оба эти вызова позволяют передать один и тот же объект параметров для компилятора TypeScript.

После вызова `bundle` мы используем `source` (наш псевдоним для vinyl-source-stream), чтобы дать получаемой сборке имя `bundle.js`.

Протестируйте страницу, запустив `gulp` и открыв в браузере страницу `dist/index.html`.
На ней должен быть текст "Привет от TypeScript".

Обратите внимание, что мы указали `debug: true` для Browserify.
Это заставляет tsify генерировать карты кода внутри создаваемого файла сборки.
Карты кода позволяют отлаживать в браузере не упакованный JavaScript-код, а исходный TypeScript.
Можно проверить, работают ли карты кода, открыв в браузере отладчик и установив точку останова в `main.ts`.
При обновлении страницы эта точка останова должна спровоцировать паузу, и браузер позволит отлаживать `greet.ts`.

# Watchify, Babel, и Uglify

Теперь, когда мы собираем код с Browserify и tsify, можно добавить к сборке различные возможности с помощью плагинов для Browserify.

* Watchify запускает gulp и держит его запущенным, выполняя инкрементальную компиляцию при сохранении какого-либо файла.
  Это позволяет автоматизировать в браузере цикл "редактирование" - "сохранение" - "обновление".

* Babel представляет собой очень гибкий компилятор, превращающий ES2015 и выше в ES5 и ES3.
  Это позволяет применять к коду обширные и настраиваемые трансформации, которые не поддерживаются TypeScript.

* Uglify минимизирует код, чтобы он загружался быстрее.

## Watchify

Начнем с Watchify и реализуем фоновую компиляцию:

```shell
npm install --save-dev watchify gulp-util
```

Теперь измените `gulpfile.js` следующим образом:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var paths = {
    pages: ['src/*.html']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
```

Здесь, фактически, три изменения, но они требуют небольшой переработки кода.

1. Мы "завернули" экземпляр `browserify` в вызов `watchify`, и сохранили результат в переменной.
2. Вызвали `watchedBrowserify.on("update", bundle);`, так что Browserify будет запускать функцию `bundle` при каждом изменении TypeScript-файлов.
3. Вызвали `watchedBrowserify.on("log", gutil.log);` для вывода сообщений на консоль.

Из-за (1) и (2) вызов `browserify` пришлось вынести из задачи `default`.
Кроме того, функции для задачи `default` пришлось дать имя, так ее будут вызывать и Watchify, и Gulp.
Добавление вывода на консоль необязательно, но полезно для отладки.

Теперь при старте Gulp он запустится и останется в запущенном состоянии.
Попробуйте изменить код `showHello` в файле `main.ts`, и сохранить его.
Вы должны будете увидеть похожий вывод:

```shell
proj$ gulp
[10:34:20] Using gulpfile ~/src/proj/gulpfile.js
[10:34:20] Starting 'copy-html'...
[10:34:20] Finished 'copy-html' after 26 ms
[10:34:20] Starting 'default'...
[10:34:21] 2824 bytes written (0.13 seconds)
[10:34:21] Finished 'default' after 1.36 s
[10:35:22] 2261 bytes written (0.02 seconds)
[10:35:24] 2808 bytes written (0.05 seconds)
```

## Uglify

Сначала установите Uglify.
Поскольку задача Ugligy заключается в обфускации кода, также придется установить vinyl-buffer и gulp-sourcemaps, чтобы карты кода продолжали работать.

```shell
npm install --save-dev gulp-uglify vinyl-buffer gulp-sourcemaps
```

Теперь измените `gulpfile.js` следующим образом:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist"));
});
```

Обратите внимание, что для `uglify` понадобился всего один вызов; вызовы `buffer` и `sourcemaps` нужны только для того, чтобы карты кода продолжали работать.
Эти вызовы создают отдельный файл с картами кода вместо внедренных в файл, которые были раньше.
Теперь можно запустить Gulp и проверить, что из кода в `bundle.js` получилось нечто нечитаемое:

```shell
gulp
cat dist/bundle.js
```

## Babel

Для начала установите Babelify.
Как и Uglify, Babelify обфусцирует код, поэтому понадобится vinyl-buffer и gulp-sourcemaps.

```shell
npm install --save-dev babelify vinyl-buffer gulp-sourcemaps
```

Теперь измените `gulpfile.js` следующим образом:

```js
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

gulp.task('copyHtml', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['copyHtml'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform("babelify")
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});
```

Также необходимо, чтобы TypeScript генерировал ES2015-код.
Тогда Babel превратит созданный TypeScript ES2015-код в ES5.
Измените `tsconfig.json`:

```json
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es2015"
    }
}
```

Для столь простого скрипта созданный Babel ES5-код должен быть очень похож на код, созданный TypeScript.

[Источник](http://typescript-lang.ru/docs/tutorials/Gulp.html)