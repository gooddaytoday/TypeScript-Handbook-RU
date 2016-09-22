// Type definitions for [~НАЗВАНИЕ БИБЛИОТЕКИ~] [~НЕОБЯЗАТЕЛЬНЫЙ НОМЕР ВЕРСИИ~]
// Project: [~НАЗВАНИЕ ПРОЕКТА~]
// Definitions by: [~ВАШЕ ИМЯ~] <[~ВАШ АДРЕС В ИНТЕРНЕТЕ~]>

/*~ Этот шаблон показывает, как создать глобальный плагин */

/*~ Напишите объявление для исходного типа и добавьте новые члены.
 *~ Например, здесь к встроенному типу `number` добавляется метод
 *~ 'toBinaryString' с двумя перегрузками
 */
interface Number {
	toBinaryString(opts?: MyLibrary.BinaryFormatOptions): string;
	toBinaryString(callback: MyLibrary.BinaryFormatCallback, opts?: MyLibrary.BinaryFormatOptions): string;
}

/*~ Если нужно объявить несколько типов, поместите их в пространство имен, чтобы
 *~ сократить добавления к глобальному пространству имен
 */
declare namespace MyLibrary {
	type BinaryFormatCallback = (n: number) => string;
	interface BinaryFormatOptions {
		prefix?: string;
		padding: number;
	}
}