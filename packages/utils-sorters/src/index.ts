function anyToString(value: any) {
	return `${value}`
}

function anyToNumber(value: any) {
	const t = typeof value
	return t === 'number' || t === 'bigint' ? value : +value
}

function diffSign<T>(a: T, b: T) {
	return a === b ? 0 : a > b ? 1 : -1
}

/**
 * A comparator that reverses the order of another comparator.
 * @param other Comparator to reverse.
 * @returns Reverse comparator.
 */
export function reversed<T, R>(other: (a: T, b: T) => R) {
	return (a: T, b: T): R => other(b, a)
}

/**
 * Compares a metric lexicographically.
 * @param fn Transformer that extracts a `string` metric from an element.
 * @returns Lexicographic comparator for the extracted metric.
 */
export function lexicographic<T>(fn: (arg: T) => string = anyToString) {
	return (a: T, b: T) => fn(a).localeCompare(fn(b))
}

/**
 * Compares extracted metrics numerically, in descending order.
 * @param fn Transformer that extracts a numeric metric from an element.
 * @returns Descending-order comparator for the extracted metric.
 */
export function descending<T>(fn: (arg: T) => number = anyToNumber) {
	return (a: T, b: T) => diffSign(fn(b), fn(a))
}

/**
 * Compares extracted metrics numerically, in ascending order.
 * @param fn Transformer that extracts a numeric metric from an element.
 * @returns Ascending-order comparator for the extracted metric.
 */
export function ascending<T>(fn: (arg: T) => number = anyToNumber) {
	return (a: T, b: T) => diffSign(fn(a), fn(b))
}
