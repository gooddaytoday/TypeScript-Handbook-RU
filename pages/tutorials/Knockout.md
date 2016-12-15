Это руководство призвано научить связывать TypeScript и [Knockout.js](http://knockoutjs.com/).

Предполагается, что вы уже используете [Node.js](https://nodejs.org/) и [npm](https://www.npmjs.com/).

# Создание структуры проекта

Начнем с создания новой папки.
Мы назовем ее `proj`, однако ей можно дать любое необходимое имя.

```shell
mkdir proj
cd proj
```

Наш проект будет иметь следующую структуру:

```text
proj/
   +- src/
   +- built/
```

Файлы TypeScript будут находиться в папке `src`, обрабатываться компилятором TypeScript, а результат помещаться в `build`.

Давайте создадим эту структуру:

```shell
mkdir src
mkdir built
```

# Установка зависимостей для сборки

Для начала убедимся, что TypeScript и Typings установлены глобально.

```shell
npm install -g typescript typings
```

Очевидно, что вы знаете, что такое TypeScript, но можете не знать о Typings.
[Typings](https://www.npmjs.com/package/typings) — это менеджер пакетов для получения файлов объявлений.
Теперь используем Typings, чтобы получить файлы объявлений для Knockout:

```shell
typings install --global --save dt~knockout
```

Опция `--global` сообщает Typings, что файлы объявлений нужно получить из [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped), репозитория с созданными сообществом файлами `.d.ts`.
Данная команда создаст файл под именем `typings.json`, и добавит папку `typings` в текущую директорию.

# Получение зависимостей времени выполнения

Нам необходимо получить саму библиотеку Knockout, а также нечто, называемое RequireJS.
[RequireJS](http://www.requirejs.org/) — это библиотека, которая позволяет асинхронно загружать модули во время выполнения.

Есть три способа, которыми можно это сделать:

1. Загрузить файлы вручную и разместить их.
2. Загрузить файлы через менеджер пакетов, например, [Bower](http://bower.io/), и разместить их.
3. Использовать систему доставки контента (CDN), чтобы разместить файлы.

Мы не будем усложнять, и выберем первый вариант, но в документации Knockout есть [подробное описание использования CDN](http://knockoutjs.com/downloads/index.html), а другие библиотеки, подобные RequireJS, можно найти на [cdnjs](https://cdnjs.com/).

Создадим папку `externals` в корне нашего проекта.

```shell
mkdir externals
```

Теперь [загрузим Knockout](http://knockoutjs.com/downloads/index.html) и [RequireJS](http://www.requirejs.org/docs/download.html#latest) в эту папку.
Самые последние и минифицированные версии этих файлов должны подойти.

# Добавление файла конфигурации TypeScript

Файлы TypeScript придется объединить — и написанный вами код, и необходимые файлы объявлений.

Для этого нужно создать файл `tsconfig.json`, содержащий список входных файлов и все настройки компиляции.
Просто создайте новый файл под именем `tsconfig.json` в корневой директории проекта, и вставьте в него следующий код:

```json
{
    "compilerOptions": {
        "outDir": "./built/",
        "sourceMap": true,
        "noImplicitAny": true,
        "module": "amd",
        "target": "es5"
    },
    "files": [
        "./typings/index.d.ts",
        "./src/require-config.ts",
        "./src/hello.ts"
    ]
}
```

Здесь включается файл `typings/index.d.ts`, который был создан Typings.
Этот файл автоматически включает все установленные зависимости.

Больше узнать о файлах `tsconfig.json` можно [здесь](../tsconfig.json.md).

# Написание кода

Напишем наш первый код на TypeScript с использованием Knockout.
Сначала создадим файл под именем `Hello.ts` в папке `src`.

```ts
import * as ko from "knockout";

class HelloViewModel {
    language: KnockoutObservable<string>
    framework: KnockoutObservable<string>

    constructor(language: string, framework: string) {
        this.language = ko.observable(language);
        this.framework = ko.observable(framework);
    }
}

ko.applyBindings(new HelloViewModel("TypeScript", "Knockout"));
```

Затем в той же папке `src` создадим файл `require-config.ts`.

```ts
declare var require: any;
require.config({
    paths: {
        "knockout": "externals/knockout-3.4.0",
    }
});
```

Этот файл сообщит RequireJS, где искать Knockout, когда мы импортируем его как в файле `hello.ts`.
Все страницы, которые вы создадите, должны включать этот файл сразу после RequireJS, но до импортирования чего-либо еще.
Чтобы лучше понять структуру данного файла и то, как настраивать RequireJS, прочтите [документацию](http://requirejs.org/docs/api.html#config).

Чтобы отобразить `HelloViewModel`, понадобится вид.
Создайте в корне проекта файл `index.html` со следующим содержимым:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Привет, Knockout!</title>
    </head>
    <body>
        <p>
            Привет от
            <strong data-bind="text: language">todo</strong>
            и
            <strong data-bind="text: framework">todo</strong>!
        </p>

        <p>Язык: <input data-bind="value: language" /></p>
        <p>Фреймворк: <input data-bind="value: framework" /></p>

        <script src="./externals/require.js"></script>
        <script src="./built/require-config.js"></script>
        <script>
            require(["built/hello"]);
        </script>
    </body>
</html>
```

Обратите внимание, что здесь три тега `script`.
Сначала мы включаем саму библиотеку RequireJS.
Затем мы задаем соответствие путям внешних зависимостей в файле `require-config.js`, чтобы RequireJS знала, где искать зависимости.
И, наконец, мы вызываем `require` со списком загружаемых модулей.

# Собираем все вместе

Просто запустите:

```shell
tsc
```

Теперь откройте `index.html` в любимом браузере, и все должно быть готово!
Вы должны увидеть страницу с текстом "Привет от TypeScript и Knockout!".
Ниже будут два поля ввода.
При изменении их содержимого и переводе фокуса исходное сообщение будет изменяться.
