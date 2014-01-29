//{YYYY}-{MM}-{DD}T{HH}:{MM}:{SS}.{SSS}Z ex. 2014-01-22T04:05:38.909Z
exports.toUtcDateTimeString = function(date) {
    return date.getUTCFullYear() + '-' + padLeft(date.getUTCMonth() + 1, 2) + '-' + padLeft(date.getUTCDate(), 2)
    	+ 'T' + padLeft(date.getUTCHours(), 2) + ':' + padLeft(date.getUTCMinutes(), 2) + ':' + padLeft(date.getUTCSeconds(), 2) + '.' + padLeft(date.getUTCMilliseconds(), 3) + 'Z';
};

function padLeft(src, digits) {
	var result = src.toString();
	if (result.length >= digits) {
		return result;
	}
	var times = digits - result.length;
	for (var i=0; i<times; i++) {
		result = '0' + result;
	}
	return result;
}