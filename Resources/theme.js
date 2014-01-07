var themeFGColorMain = '#ffffff';
var themeFGColorSub = '#cccccc';
var themeGlobalBGColor = '#2980b9';
var themeGlobalBGColorLight = '#3498db';
var themeTalkBGColor = '#16a085';
var themeTalkBGColorLight = '#1abc9c';
var themePrivateBGColor = '#e2620c';
var themePrivateBGColorLight = '#e67e22';
var themeDefaultBGColor = '#444444';
var themeDefaultBGColorLight = '#666666';

exports.colorMain = function() {
	return themeFGColorMain;
};

exports.colorSub = function() {
	return themeFGColorSub;
};

exports.backgroundColor = function(theme) {
	switch (theme) {
		case 'global':
			var ret = themeGlobalBGColor;
			break;
		case 'talk':
			var ret = themeTalkBGColor;
			break;
		case 'private':
			var ret = themePrivateBGColor;
			break;
		default:
			var ret = themeDefaultBGColor;
			break;
	}
	return ret;
};

exports.backgroundColorLight = function(theme) {
	switch (theme) {
		case 'global':
			var ret = themeGlobalBGColorLight;
			break;
		case 'talk':
			var ret = themeTalkBGColorLight;
			break;
		case 'private':
			var ret = themePrivateBGColorLight;
			break;
		default:
			var ret = themeDefaultBGColorLight;
			break;
	}
	return ret;
};