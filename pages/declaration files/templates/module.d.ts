// Type definitions for [~НАЗВАНИЕ БИБЛИОТЕКИ~] [~НЕОБЯЗАТЕЛЬНЫЙ НОМЕР ВЕРСИИ~]
// Project: [~НАЗВАНИЕ ПРОЕКТА~]
// Definitions by: [~ВАШЕ ИМЯ~] <[~ВАШ АДРЕС В ИНТЕРНЕТЕ~]>

/*~ Это шаблон модуля. Его нужно переименовать в index.d.ts
 *~ и поместить в папку с тем же именем, что и имя модуля.
 *~ Например, если вы создаете файл для "super-greeter", то этот файл
 *~ должен называться "super-greeter/index.d.ts"
 */

/*~ Если это UMD-модуль, который предоставляет глобальную переменную 'myClassLib'
 *~ при загрузке в окружении без загрузчика модулей, объявите эту переменную здесь.
 *~ В противном случае удалите это объявление.
 */
export as namespace myLib;

/*~ Если у этого модуля есть методы, объявите их как функции вот так:
 */
export function myMethod(a: string): string;
export function myOtherMethod(a: number): number;

/*~ Можно объявить типы, которые будут доступны через импорт */
export interface someType {
	name: string;
	length: number;
	extras?: string[];
}

/*~ Свойства модуля можно объявлять c помощью const, let или var */
export const myField: number;

/*~ Если существуют типы, свойства или методы модуля, доступные через точку,
 *~ объявите их внутри пространства имен */
export namespace subProp {
	/*~ Например, с этим объявлением можно написать:
	 *~   import { subProp } from 'yourModule';
	 *~   subProp.foo();
     *~ или
     *~   import * as yourMod from 'yourModule';
     *~   yourMod.subProp.foo();
     */
	export function foo(): void;
}

