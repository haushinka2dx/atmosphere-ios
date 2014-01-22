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

exports.pullToRefreshTableHeader = function(formatDate) {
    return {
        border:{
            backgroundColor : '#576c89',
            height : 2,
            bottom : 0,
        },
        tableHeader:{
            backgroundColor : '#e2e7ed',
            width : 320,
            height : 60
        },
        arrow:{
            //backgroundImage:'images/whiteArrow.png',// TODO 画像が・・・
            width:23,
            height:60,
            bottom:10,
            left:20
        },
        statusLabel : {
            text:"Pull to reload",
            left:55,
            width:200,
            bottom:30,
            height:"auto",
            color:"#576c89",
            textAlign:"center",
            font:{fontSize:13,fontWeight:"bold"},
            shadowColor:"#999",
            shadowOffset:{x:0,y:1}
        },
        lastUpdatedLabel : {
            text:"Last Updated: " + formatDate,
            left:55,
            width:200,
            bottom:15,
            height:"auto",
            color:"#576c89",
            textAlign:"center",
            font:{fontSize:12},
            shadowColor:"#999",
            shadowOffset:{x:0,y:1}
        },
        actInd : {
            left:20,
            bottom:13,
            width:30,
            height:30
        }
    };
}
