# Введение

Цель данного руководства — научить созданию высококачественных файлов объявлений.
Руководство структурировано так, что вместе с документацией для определенного API показывается пример его использования, и объясняется, как нужно записать соответствующее объявление.

Примеры упорядочены в порядке примерного возрастания сложности.

* [Глобальные переменные](#Глобальные-переменные)
* [Глобальные функции](#Глобальные-функции)
* [Объекты со свойствами](#Объекты-со-свойствами)
* [Перегруженные функции](#Перегруженные функции)
* [Переиспользуемые типы (интерфейсы)](#Переиспользуемые-типы-интерфейсы)
* [Переиспользуемые типы (псевдонимы типов)](#Переиспользуемые-типы-псевдонимы-типов)
* [Упорядочивание типов](#Упорядочивание-типов)
* [Классы](#Классы)

# Примеры

## Глобальные переменные

*Документация*

> Глобальная переменная `foo` содержит число виджетов.

*Код*

```ts
console.log("Половина числа виджетов: " + (foo / 2));
```

*Объявление*

Используйте `declare var`, чтобы объявлять переменные.
Если переменная только для чтения, можно использовать `declare const`.
Также можно использовать `declare let`, если область видимости переменной ограничена блоком.

```ts
/** Число виджетов */
declare var foo: number;
```

## Глобальные функции

*Документация*

> Можно вызвать функцию `greet` со строкой, чтобы вывести пользователю приветствие.

*Код*

```ts
greet("привет, мир");
```

*Объявление*

Используйте `declare function`, чтобы объявить функцию.

```ts
declare function greet(greeting: string): void;
```

## Объекты со свойствами

*Документация*

> У глобальной переменной `myLib` есть функция `makeGreeting` для создания приветствий,
> и свойство `numberOfGreetings`, отражающее число уже созданных приветствий.

*Код*

```ts
let result = myLib.makeGreeting("привет, мир");
console.log("Вычисленное приветствие:" + result);

let count = myLib.numberOfGreetings;
```

*Объявление*

Используйте `declare namespace`, чтобы описать типы или значения, доступные посредством синтаксиса с точкой.

```ts
declare namespace myLib {
    function makeGreeting(s: string): string;
    let numberOfGreetings: number;
}
```

## Перегруженные функции

*Документация*

Функция `getWidget` принимает число и возвращает объект `Widget`, или же принимает строку и возвращает массив объектов `Widget`.

*Код*

```ts
let x: Widget = getWidget(43);

let arr: Widget[] = getWidget("все виджеты");
```

*Объявление*

```ts
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
```

## *Переиспользуемые типы (интерфейсы)*

*Документация*

> При указании приветствия нужно передать объект `GreetingSettings`.
> Этот объект обладает следующими свойствами:
> - greeting: Обязательная строка
> - color: Необязательная строка, например '#ff00ff'

*Код*

```ts
greet({
  greeting: "привет, мир",
  duration: 4000
});
```

*Объявление*

Используйте `interface`, чтобы объявить тип со свойствами.

```ts
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}

declare function greet(setting: GreetingSettings): void;
```

## Переиспользуемые типы (псевдонимы типов)

*Документация*

> Везде, где ожидается приветствие, можно указать `string`, функцию, возвращающую `string`, или экземпляр `Greeter`.

*Код*

```ts
function getGreeting() {
    return "как дела?";
}
class MyGreeter extends Greeter { }

greet("привет");
greet(getGreeting);
greet(new MyGreeter());
```

*Объявление*

Можно использовать псевдоним типа и создать сокращение:

```ts
type GreetingLike = string | (() => string) | Greeting;

declare function greet(g: GreetingLike): void;
```

## Упорядочивание типов

*Документация*

> Объект `greeter` может записывать журнал в файл либо показывать уведомления.
> Можно передать `LogOptions` функции `.log(...)` и `AlertOptions` функции `.alert(...)`

*Код*

```ts
const g = new Greeter("Привет");
g.log({ verbose: true });
g.alert({ modal: false, title: "Текущее приветствие" });
```

*Объявление*

Используйте пространства имен для упорядочения типов:

```ts
declare namespace GreetingLib {
    interface LogOptions {
        verbose?: boolean;
    }
    interface AlertOptions {
        modal: boolean;
        title?: string;
        color?: string;
    }
}
```

Также можно создавать вложенные пространства имен в одном объявлении:

```ts
declare namespace GreetingLib.Options {
    // Можно использовать как GreetingLib.Options.Log
    interface Log {
        verbose?: boolean;
    }
    interface Alert {
        modal: boolean;
        title?: string;
        color?: string;
    }
}
```

## Классы

*Документация*

> Можно создать объект `Greeter` с помощью конструктора, либо создать измененный `Greeter`, производный от него.

*Код*

```ts
const myGreeter = new Greeter("привет, мир");
myGreeter.greeting = "как дела?";
myGreeter.showGreeting();

class SpecialGreeter extends Greeter {
    constructor() {
        super("Особенное приветствие");
    }
}
```

*Объявление*

Используйте `declare class`, чтобы описать класс или объект, похожий на класс.
Классы могут иметь свойства, методы, а также конструктор.

```ts
declare class Greeter {
    constructor(greeting: string);

    greeting: string;
    showGreeting(): void;
}
```

