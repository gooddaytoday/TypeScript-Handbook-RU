// Type definitions for [~НАЗВАНИЕ БИБЛИОТЕКИ~] [~НЕОБЯЗАТЕЛЬНЫЙ НОМЕР ВЕРСИИ~]
// Project: [~НАЗВАНИЕ ПРОЕКТА~]
// Definitions by: [~ВАШЕ ИМЯ~] <[~ВАШ АДРЕС В ИНТЕРНЕТЕ~]>

/*~ Если библиотека может быть вызвана (например, как myLib(3)),
 *~ добавьте здесь сигнатуры вызова.
 *~ В противном случае удалите эту секцию.
 */
declare function myLib(a: string): string;
declare function myLib(a: number): number;

/*~ Если нужно, чтобы имя этой библиотеки было корректным именем типа,
 *~ это можно сделать здесь.
 *~
 *~ Например, это позволяет написать 'var x: myLib';
 *~ Убедитесь, что это имеет смысл! Если нет, просто
 *~ удалите это объявление и добавляйте типы в пространство имен ниже
 */
interface myLib {
	name: string;
	length: number;
	extras?: string[];
}

/*~ Если библиотека имеет свойства, доступные через глобальную переменную
 *~ поместите их здесь.
 *~ Также здесь можно поместить типы (интерфейсы и псевдонимы типов).
 */
declare namespace myLib {
	//~ Можно написать 'myLib.timeout = 50;'
	let timeout: number;

	//~ Можно получить доступ к 'myLib.version', но не изменить
	const version: string;

	//~ Здесь какой-нибудь класс, объекты которого можно
	//~ создать как 'let c = new myLib.Cat(42)'
	//~ или ссылаться на него, например 'function f(c: myLib.Cat) { ... }
	class Cat {
		constructor(n: number);

		//~ Можно читать значение 'c.age' экземпляра 'Cat'
		readonly age: number;

		//~ Можно вызвать 'c.purr()' на экземпляре 'Cat'
		purr(): void;
	}

	//~ Можно объявить переменную как
	//~   'var s: myLib.CatSettings = { weight: 5, name: "Maru" };'
	interface CatSettings {
		weight: number;
		name: string;
		tailLength?: number;
	}

	//~ Можно написать 'const v: myLib.VetID = 42;'
	//~  или 'const v: myLib.VetID = "bob";'
	type VetID = string | number;

	//~ Можно вызвать как 'myLib.checkCat(c)' или 'myLib.checkCat(c, v);'
	function checkCat(c: Cat, s?: VetID);
}
