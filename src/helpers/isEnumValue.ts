export function isEnumValue<T extends Record<string, string>>(
	enumObj: T,
	value: unknown
): value is T[keyof T] {
	return Object.values(enumObj).includes(value as string);
}
