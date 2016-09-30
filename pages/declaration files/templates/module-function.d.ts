// Type definitions for [~НАЗВАНИЕ БИБЛИОТЕКИ~] [~НЕОБЯЗАТЕЛЬНЫЙ НОМЕР ВЕРСИИ~]
// Project: [~НАЗВАНИЕ ПРОЕКТА~]
// Definitions by: [~ВАШЕ ИМЯ~] <[~ВАШ АДРЕС В ИНТЕРНЕТЕ~]>

/*~ Это шаблон модуля, который является функцией. Его нужно переименовать в index.d.ts
 *~ и поместить в папку с тем же именем, что и имя модуля.
 *~ Например, если вы создаете файл для "super-greeter", то этот файл
 *~ должен называться "super-greeter/index.d.ts"
 */

/*~ Обратите внимание, что ES6-модули не могут напрямую экспортировать вызываемые функции.
 *~ Этот файл следует импортировать, используя CommonJS:
 *~   import x = require('someLibrary');
 *~
 *~ Обратитесь к документации, чтобы узнать о распространенных способах
 *~ обхода данного ограничения для ES6-модулей.
 */

/*~ Если это UMD-модуль, который предоставляет глобальную переменную 'myClassLib'
 *~ при загрузке в окружении без загрузчика модулей, объявите эту переменную здесь.
 *~ В противном случае удалите это объявление.
 */
export as namespace myFuncLib;

/*~ Это объявление указывает, что эта функция экспортируется
 *~ из данного файла
 */
export = MyFunction;

/*~ Этот пример показывает, как добавить перегрузки к экспортируемой функции */
declare function MyFunction(name: string): MyFunction.NamedReturnType;
declare function MyFunction(length: number): MyFunction.LengthReturnType;

/*~ Если этот модуль должен предоставлять типы, то их можно поместить
 *~ в этот блок. Зачастую требуется описать форму типа значения, возвращаемого
 *~ функцией; тип для этого должен быть объявлен здесь, как показано в примере.
 */
declare namespace MyFunction {
	export interface LengthReturnType {
		width: number;
		height: number;
	}
	export interface NamedReturnType {
		firstName: string;
		lastName: string;
	}

	/*~ Если у модуля также есть свойства, объявите их здесь. Например, данное
	 *~ объявление указывает, что следующий код допустим:
	 *~   import f = require('myFuncLibrary');
	 *~   console.log(f.defaultName);
	 */
	export const defaultName: string;
	export let defaultLength: number;
}
