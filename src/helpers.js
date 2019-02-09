export function getPrettyTime(timeInt) {
	if (timeInt / 10 >= 1) {
		return timeInt.toString();
	}
	return `0${timeInt.toString()}`;
}
