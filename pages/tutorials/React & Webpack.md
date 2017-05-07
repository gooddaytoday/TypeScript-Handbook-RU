Это руководство призвано научить связывать TypeScript с [React](http://facebook.github.io/react/) и [webpack](http://webpack.github.io/).

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
   |    +- components/
   |
   +- dist/
```

Файлы TypeScript будут находиться в папке `src`, обрабатываться компилятором TypeScript, затем webpack, и в итоге будет получен файл `bundle.js` в папке `dist`.
Все создаваемые нами компоненты будут находиться в папке `src/components`.

Давайте создадим эту структуру:

```shell
mkdir src
cd src
mkdir components
cd ..
mkdir dist
```

# Инициализация проекта

Давайте сделаем из этой папки npm-пакет.

```shell
npm init
```

Вам зададут несколько вопросов.
Для всех можно использовать вариант ответа по умолчанию, кроме вопроса о точке входа (`entry point:`).
В качестве точки входа используйте `./dist/bundle.js`.
Вы всегда можете вернуться и изменить все, что указали, в сгенерированном файле `package.json`.

# Установка зависимостей

Для начала убедимся, что TypeScript, Typings и webpack установлены глобально.

```shell
npm install -g typescript typings webpack
```

Webpack — это инструмент, который упаковывает код и, опционально, все его зависимости в единый `.js`-файл.
[Typings](https://www.npmjs.com/package/typings) — это менеджер пакетов для получения файлов объявлений.

Добавим зависимости от React и React-DOM в файл `package.json`:

```shell
npm install --save react react-dom
```

Затем добавим зависимости времени разработки от [ts-loader](https://www.npmjs.com/package/ts-loader) и [source-map-loader](https://www.npmjs.com/package/source-map-loader).

```shell
npm install --save-dev ts-loader source-map-loader
npm link typescript
```

Обе эти зависимости призваны связать TypeScript и webpack друг с другом.
ts-loader помогает webpack собирать файлы TypeScript, используя стандартный файл конфигурации под именем `tsconfig.json`.
source-map-loader использует сгенерированные TypeScript карты кода, чтобы помочь webpack создать *свои собственные* карты кода.
Это позволит отлаживать итоговый выходной файл, словно исходный код на TypeScript.

Связывание пакета TypeScript (с помощью команды `npm link`) позволяет использовать глобальную версию TypeScript вместо отдельной локальной копии.
Если требуется именно локальная копия, запустите `npm install typescript`.

И, наконец, используем Typings, чтобы получить файлы объявлений для React и ReactDOM:

```shell
typings install --global --save dt~react
typings install --global --save dt~react-dom
```

Опция `--global`, вместе с префиксом `dt~`, сообщает Typings, что файлы объявлений нужно получить из [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped), репозитория с созданными сообществом файлами `.d.ts`.

Данная команда создаст файл под именем `typings.json`, и добавит в текущую директорию папку `typings`.

# Добавление файла конфигурации TypeScript

Файлы TypeScript придется объединить — и написанный вами код, и необходимые файлы объявлений.

Для этого нужно создать файл `tsconfig.json`, содержащий список входных файлов и все настройки компиляции.
Просто создайте новый файл под именем `tsconfig.json` в корневой директории проекта, и вставьте в него следующий код:

```json
{
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap": true,
        "noImplicitAny": true,
        "module": "commonjs",
        "target": "es5",
        "jsx": "react"
    },
    "files": [
        "./typings/index.d.ts",
        "./src/components/Hello.tsx",
        "./src/index.tsx"
    ]
}
```

Здесь включается файл `typings/index.d.ts`, который был создан Typings.
Этот файл автоматически включает все установленные зависимости.

Больше узнать о файлах `tsconfig.json` можно [здесь](../tsconfig.json.html).

# Написание кода

Напишем наш первый TypeScript-файл с использованием React.
Сначала создадим файл под именем `Hello.tsx` в `src/components` и напишем следующее:

```ts
import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return <h1>Привет от {this.props.compiler} и {this.props.framework}!</h1>;
    }
}
```

Обратите внимание, что хотя в этом примере были применены классы, это не обязательно.
Иные способы использования React (например, [функциональные компоненты без состояния](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions)) также должны работать.

Теперь создадим в `src` файл `index.tsx` со следующим кодом:

```ts
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);
```

Мы импортировали наш компонент `Hello` в `index.tsx`.
Обратите внимание, что в отличие от `"react"` и `"react-dom"`, здесь используется *относительный путь* к `index.tsx` — это важно.
Если бы это было не так, то TypeScript искал бы этот файл в папке `node_modules`.

Еще необходима страница, которая будет отображать компонент `Hello`.
Создайте в корне проекта файл `index.html` со следующим содержимым:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Привет, React!</title>
    </head>
    <body>
        <div id="example"></div>

        <!-- Dependencies -->
        <script src="./node_modules/react/dist/react.js"></script>
        <script src="./node_modules/react-dom/dist/react-dom.js"></script>

        <!-- Main -->
        <script src="./dist/bundle.js"></script>
    </body>
</html>
```

Обратите внимание, что здесь мы включаем файлы из `node_modules`.
В пакетах React и React-DOM присутствуют `.js`-файлы, которые можно включать прямо на веб-страницу, и мы ссылаемся на них напрямую, чтобы не тратить времени.
Но можно было бы скопировать эти файлы в другую директорию, или же разместить их в системе доставки контента (CDN).
Facebook предоставляет доступные через CDN версии React; подробнее от этом можно [прочесть здесь](http://facebook.github.io/react/downloads.html#development-vs.-production-builds).

# Создание файла конфигурации webpack

Создайте файл `webpack.config.js` в корневой директории проекта.

```js
module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "./dist/bundle.js",
    },

    // Включить карты кода для отладки вывода webpack
    devtool: "source-map",

    resolve: {
        // Добавить разрешения '.ts' и '.tsx' к обрабатываемым
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // Все файлы с разрешениями '.ts' или '.tsx' будет обрабатывать 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            // Все карты кода для выходных '.js'-файлов будет дополнительно обрабатывать `source-map-loader`
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // При импортировании модуля, чей путь совпадает с одним из указанных ниже,
    // предположить, что соответствующая глобальная переменная существует, и использовать
    // ее взамен. Это важно, так как позволяет избежать добавления в сборку всех зависимостей,
    // что дает браузерам возможность кэшировать файлы библиотек между различными сборками.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};
```

Поле `externals` может показаться интересным.
Дело в том, что мы хотим избежать добавления в итоговый файл всех файлов React, поскольку это увеличило бы время сборки, и не позволило бы браузеру кешировать не изменившиеся библиотеки.

В идеале можно было бы просто импортировать модуль React прямо в браузере, но большинство браузеров на сегодняшний день не поддерживают модулей.
Вместо этого библиотеки используют традиционный подход с предоставлением одной глобальной переменой, например `jQuery` или `_`.
Это называется шаблоном организации пространства имен ("namespace pattern"), и webpack позволяет использовать библиотеки, созданные на основе этого шаблона.
Указав `"react": "React"`, мы позволяем webpack совершить некие магические действия, которые дадут возможность импортировать `"react"` из переменной `React`.

Больше о настройке webpack можно узнать [здесь](http://webpack.github.io/docs/configuration.html).

# Собираем все вместе

Просто запустите:

```shell
webpack
```

Теперь откройте `index.html` в любимом браузере, и все должно быть готово!
Вы должны увидеть страницу с текстом "Привет от TypeScript и React!".
