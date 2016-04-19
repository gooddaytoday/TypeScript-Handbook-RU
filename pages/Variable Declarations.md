# Variable Declarations

`let` и `const` - относительно новые типы объявления переменных в JavaScript.
Как мы упомянули ранее, `let` похож на `var`в некотором смысле, но позволяет пользователям избежать некоторые из общих ошибок, с которыми сталкиваются в JavaScript.
`const` это расширение `let`, которое предотвращает переопределение переменных.

Так как TypeScript является надстройкой над Javascript, язык также поддерживает `let` и `const`.
Далее мы подробнее расскажем об этих новых объявлениях переменных и объясним, почему они более предпочтительны, чем `var`.

Если вы использовали JavaScript поверхностно, следующая секция секция поможет освежить некоторые важные моменты.
Если вы хорошо знакомы со всеми причудами объявления `var` в JavaScript, вы можете пропустить эту часть.

# Объявления `var` 

Объявление переменной в JavaScript всегда происходит с помощью ключевого слова `var`.

```ts
var a = 10;
```

Как вы наверняка поняли, мы только что объявили переменную с именем `a` и значением `10`.

Мы также можем объявить переменную внутри функции:

```ts
function f() {
    var message = "Hello, world!";

    return message;
}
```

и мы также имеем доступ к этим переменным внутри других функций:

```ts
function f() {
    var a = 10;
    return function g() {
        var b = a + 1;
        return b;
    }
}

var g = f();
g(); // возвращает 11;
```

В примере выше `g` захватывает(замыкает в себе) переменную `a`, объявленную в `f`.
В любой точке, где будет вызвана `g`, значение `a` будет связано со значением `a` в функции `f`.
Даже если `g` вызвана однажды и `f` закончила выполнение, можно получить доступ и модифицировать `a`.

```ts
function f() {
    var a = 1;

    a = 2;
    var b = g();
    a = 3;

    return b;

    function g() {
        return a;
    }
}

f(); // возвращает 2
```

## Правила области видимости (Scoping)

Объявление `var` имеет несколько странных правил области видимости для тех, кто использует другие языки программирования.
Посмотрите не следующий пример:

```ts
function f(shouldInitialize: boolean) {
    if (shouldInitialize) {
        var x = 10;
    }

    return x;
}

f(true);  // returns '10'
f(false); // returns 'undefined'
```

Некоторые могут повторно посмотреть на тот пример.
Переменная `x` была объявлена *внутри блока `if`*, и мы можем получить к ней доступ вне этого блока. 
Это потому что объявления `var` доступны где бы то ни было внутри содержащей их функции, модуля, пространства имен(namespace) или же глобальной области видимости несмотря на блок, в котором они содержатся.
Некоторые называют это *`var`-видимость* or *function-видимость*.
Параметры также видны внутри функции.

Эти правила области видимости могут вызвать несколько тпиов ошибок.
Одна из раздражающих проблем - это то, что не является ошибкой объявление переменной несколько раз:

```ts
function sumMatrix(matrix: number[][]) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (var i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}
```

Скорее всего несложно заметить, что внутренний цикл `for` случайно перезапишет переменную `i`,  потому что `i` имеет области видимости внутри функции sumMatrix. 
Опытные разработчики знают, что похожие ошибки проскальзывают при code review и могут быть причиной бесконечной фрустрации.

## Variable capturing quirks

Попробуйте быстро догадаться, какой будет вывод у этого кода:

```ts
for (var i = 0; i < 10; i++) {
    setTimeout(function() {console.log(i); }, 100 * i);
}
```

Для тех, кто незнаком, `setTimeout` пытается выполнить функцию после указанного количества миллисекунд (при это ожидая, пока какой-либо другой код прекратит выполняться)


Готовы? Вот результат::

```text
10
10
10
10
10
10
10
10
10
10
```
Многие JavaScript разработчики знакомы с таким поведением, но если вы удивлены, вы определенно не одиноки.
Большинство ожидает, что вывод будет таким:

```text
0
1
2
3
4
5
6
7
8
9
```

Помните, что мы упомянули ранее о замыкании переменных?

> В любой точке, где будет вызвана `g`, значение `a` будет связано со значением `a` в функции `f`.

Давайте рассмотрим это в контексте нашего примера.
`setTimeout` запустит функцию через несколько миллисекунд, после завершения цикла `for`.
К моменту, когда цикл `for` закончит выполнение, `i` бцдет равняться `10`.
Поэтому каждый раз, когда отложенная функция будет вызвана, она возвратит `10`!

Самый простой способ решить проблему - использовать немедленный запуск анонимной функции, чтобы захватить `i` на каждой итерации:

```ts
for (var i = 0; i < 10; i++) {
    // capture the current state of 'i'
    // by invoking a function with its current value
    (function(i) {
        setTimeout(function() { console.log(i); }, 100 * i);
    })(i);
}
```

This odd-looking pattern is actually a commonplace.
The `i` in the parameter actually shadows the `i` declared in the `for` loop, but since we named it the same, we didn't have to modify the loop body too much.

# `let` declarations

By now you've figured out that `var` has some problems, which is precisely why `let` statements are a new way to declare variables.
Apart from the keyword used, `let` statements are written the same way `var` statements are.

```ts
let hello = "Hello!";
```

The key difference is not in the syntax, but in the semantics, which we'll now dive into.

## Block-scoping

When a variable is declared using `let`, it uses what some call *lexical-scoping* or *block-scoping*.
Unlike variables declared with `var` whose scopes leak out to their containing function, block-scoped variables are not visible outside of their nearest containing block or `for`-loop.

```ts
function f(input: boolean) {
    let a = 100;

    if (input) {
        // Still okay to reference 'a'
        let b = a + 1;
        return b;
    }

    // Error: 'b' doesn't exist here
    return b;
}
```

Here, we have two local variables `a` and `b`.
`a`'s scope is limited to the body of `f` while `b`'s scope is limited to the containing `if` statement's block.

Variables declared in a `catch` clause also have similar scoping rules.

```ts
try {
    throw "oh no!";
}
catch (e) {
    console.log("Oh well.");
}

// Error: 'e' doesn't exist here
console.log(e);
```

Another property of block-scoped variables is that they can't be read or written to before they're actually declared.
While these variables are "present" throughout their scope, all points up until their declaration are part of their *temporal dead zone*.
This is just a sophisticated way of saying you can't access them before the `let` statement, and luckily TypeScript will let you know that.

```ts
a++; // illegal to use 'a' before it's declared;
let a;
```

Something to note is that you can still *capture* a block-scoped variable before it's declared.
The only catch is that it's illegal to call that function before the declaration.
If targeting ES2015, a modern runtime will throw an error; however, right now TypeScript is permissive and won't report this as an error.

```ts
function foo() {
    // okay to capture 'a'
    return a;
}

// illegal call 'foo' before 'a' is declared
// runtimes should throw an error here
foo();

let a;
```

For more information on temporal dead zones, see relevant content on the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_errors_with_let).

## Re-declarations and Shadowing

With `var` declarations, we mentioned that it didn't matter how many times you declared your variables; you just got one.

```ts
function f(x) {
    var x;
    var x;

    if (true) {
        var x;
    }
}
```

In the above example, all declarations of `x` actually refer to the *same* `x`, and this is perfectly valid.
This often ends up being a source of bugs.
Thankfully, `let` declarations are not as forgiving.

```ts
let x = 10;
let x = 20; // error: can't re-declare 'x' in the same scope
```

The variables don't necessarily need to both be block-scoped for TypeScript to tell us that there's a problem.

```ts
function f(x) {
    let x = 100; // error: interferes with parameter declaration
}

function g() {
    let x = 100;
    var x = 100; // error: can't have both declarations of 'x'
}
```

That's not to say that block-scoped variable can never be declared with a function-scoped variable.
The block-scoped variable just needs to be declared within a distinctly different block.

```ts
function f(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}

f(false, 0); // returns 0
f(true, 0);  // returns 100
```

The act of introducing a new name in a more nested scope is called *shadowing*.
It is a bit of a double-edged sword in that it can introduce certain bugs on its own in the event of accidental shadowing, while also preventing certain bugs.
For instance, imagine we had written our earlier `sumMatrix` function using `let` variables.

```ts
function sumMatrix(matrix: number[][]) {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (let i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}
```

This version of the loop will actually perform the summation correctly because the inner loop's `i` shadows `i` from the outer loop.

Shadowing should *usually* be avoided in the interest of write clearer code.
While there are some scenarios where it may be fitting to take advantage of it, you should use your best judgement.

## Block-scoped variable capturing

When we first touched on the idea of variable capturing with `var` declaration, we briefly went into how variables act once captured.
To give a better intuition of this, each time a scope is run, it creates an "environment" of variables.
That environment and its captured variables can exist even after everything within its scope has finished executing.

```ts
function theCityThatAlwaysSleeps() {
    let getCity;

    if (true) {
        let city = "Seattle";
        getCity = function() {
            return city;
        }
    }

    return getCity();
}
```

Because we've captured `city` from within its environment, we're still able to access it despite the fact that the `if` block finished executing.

Recall that with our earlier `setTimeout` example, we ended up needing to use an IIFE to capture the state of a variable for every iteration of the `for` loop.
In effect, what we were doing was creating a new variable environment for our captured variables.
That was a bit of a pain, but luckily, you'll never have to do that again in TypeScript.

`let` declarations have drastically different behavior when declared as part of a loop.
Rather than just introducing a new environment to the loop itself, these declarations sort of create a new scope *per iteration*.
Since this is what we were doing anyway with our IIFE, we can change our old `setTimeout` example to just use a `let` declaration.

```ts
for (let i = 0; i < 10 ; i++) {
    setTimeout(function() {console.log(i); }, 100 * i);
}
```

and as expected, this will print out

```text
0
1
2
3
4
5
6
7
8
9
```

# `const` declarations

`const` declarations are another way of declaring variables.

```ts
const numLivesForCat = 9;
```

They are like `let` declarations but, as their name implies, their value cannot be changed once they are bound.
In other words, they have the same scoping rules as `let`, but you can't re-assign to them.

This should not be confused with the idea that the values they refer to are *immutable*.

```ts
const numLivesForCat = 9;
const kitty = {
    name: "Aurora",
    numLives: numLivesForCat,
}

// Error
kitty = {
    name: "Danielle",
    numLives: numLivesForCat
};

// all "okay"
kitty.name = "Rory";
kitty.name = "Kitty";
kitty.name = "Cat";
kitty.numLives--;
```

Unless you take specific measures to avoid it, the internal state of a `const` variable is still modifiable.

# `let` vs. `const`

Given that we have two types of declarations with similar scoping semantics, it's natural to find ourselves asking which one to use.
Like most broad questions, the answer is: it depends.

Applying the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege), all declarations other than those you plan to modify should use `const`.
The rationale is that if a variable didn't need to get written to, others working on the same codebase shouldn't automatically be able to write to the object, and will need to consider whether they really need to reassign to the variable.
Using `const` also makes code more predictable when reasoning about flow of data.

On the other hand, `let` is not any longer to write out than `var`, and many users will prefer its brevity.
The majority of this handbook uses `let` declarations in that interest.

Use your best judgement, and if applicable, consult the matter with the rest of your team.

# Destructuring

Another ECMAScript 2015 feature that TypeScript has is destructuring.
For a complete reference, see [the article on the Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
In this section, we'll give a short overview.

## Array destructuring

The simplest form of destructuring is array destructuring assignment:

```ts
let input = [1, 2];
let [first, second] = input;
console.log(first); // outputs 1
console.log(second); // outputs 2
```

This creates two new variables named `first` and `second`.
This is equivalent to using indexing, but is much more convenient:

```ts
first = input[0];
second = input[1];
```

Destructuring works with already-declared variables as well:

```ts
// swap variables
[first, second] = [second, first];
```

And with parameters to a function:

```ts
function f([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
}
f(input);
```

You can create a variable for the remaining items in a list using the syntax `...name`:

```ts
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
```

Of course, since this is JavaScript, you can just ignore trailing elements you don't care about:

```ts
let [first] = [1, 2, 3, 4];
console.log(first); // outputs 1
```

Or other elements:

```ts
let [, second, , fourth] = [1, 2, 3, 4];
```

## Object destructuring

You can also destructure objects:

```ts
let o = {
    a: "foo",
    b: 12,
    c: "bar"
}
let {a, b} = o;
```

This creates new variables `a` and `b` from `o.a` and `o.b`.
Notice that you can skip `c` if you don't need it.

Like array destructuring, you can have assignment without declaration:

```ts
({a, b} = {a: "baz", b: 101});
```

Notice that we had to surround this statement with parentheses.
JavaScript normally parses a `{` as the start of block.

### Property renaming

You can also give different names to properties:

```ts
let {a: newName1, b: newName2} = o;
```

Here the syntax starts to get confusing.
You can read `a: newName1` as "`a` as `newName1`".
The direction is left-to-right, as if you had written:

```ts
let newName1 = o.a;
let newName2 = o.b;
```

Confusingly, the colon here does *not* indicate the type.
The type, if you specify it, still needs to be written after the entire destructuring:

```ts
let {a, b}: {a: string, b: number} = o;
```

### Default values

Default values let you specify a default value in case a property is undefined:

```ts
function keepWholeObject(wholeObject: {a: string, b?: number}) {
    let {a, b = 1001} = wholeObject;
}
```

`keepWholeObject` now has a variable for `wholeObject` as well as the properties `a` and `b`, even if `b` is undefined.

## Function declarations

Destructuring also works in function declarations.
For simple cases this is straightforward:

```ts
type C = {a: string, b?: number}
function f({a, b}: C): void {
    // ...
}
```

But specifying defaults is more common for parameters, and getting defaults right with destructuring can be tricky.
First of all, you need to remember to put the type before the default value.

```ts
function f({a, b} = {a: "", b: 0}): void {
    // ...
}
f(); // ok, default to {a: "", b: 0}
```

Then, you need to remember to give a default for optional properties on the destructured property instead of the main initializer.
Remember that `C` was defined with `b` optional:

```ts
function f({a, b = 0} = {a: ""}): void {
    // ...
}
f({a: "yes"}) // ok, default b = 0
f() // ok, default to {a: ""}, which then defaults b = 0
f({}) // error, 'a' is required if you supply an argument
```

Use destructuring with care.
As the previous example demonstrates, anything but the simplest destructuring expressions have a lot of corner cases.
This is especially true with deeply nested destructuring, which gets *really* hard to understand even without piling on renaming, default values, and type annotations.
Try to keep destructuring expressions small and simple.
You can always write the assignments that destructuring would generate yourself.
