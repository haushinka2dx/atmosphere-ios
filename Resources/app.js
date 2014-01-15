// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#ffffff');

var theme = require('theme');
var colorMain = theme.colorMain();
var colorSub = theme.colorSub();
var backgroundColor = theme.backgroundColor();
var backgroundColorLight = theme.backgroundColorLight();

var atmos = require('atmos');
atmos.whoami(
	function(e) {
		var resJSON = JSON.parse(e.source.responseText);
		Ti.API.info('resJSON: ' + JSON.stringify(resJSON));
		atmos.currentUserId(resJSON['user_id']);
		startMainWindow();
	},
	function(e) {
		showSignInWindow();
	}
);

function showSignInWindow() {
	var loginWindow = Ti.UI.createWindow({
		url: 'login_view.js',
		title: 'Sign In',
		color: colorMain,
		layout: 'vertical',
		backgroundColor: backgroundColor,
		backgroundColorLight: backgroundColorLight,
		onsuccess: startMainWindow
	});
	loginWindow.open();
}

function startMainWindow() {

	atmos.whoami(
		function(e) {
			var resJSON = JSON.parse(e.source.responseText);
			Ti.API.info('resJSON: ' + JSON.stringify(resJSON));
			if (resJSON.status == 'ok') {
				atmos.currentUserId(resJSON['user_id']);
			}
			else {
				alert('whoami was failed.');
			}
		},
		function(e) {
			alert('whoami was failed.');
		}
	);

	// create tab group
	var tabGroup = Titanium.UI.createTabGroup();

	//
	// create base UI tab and root window
	//
	var win1 = Titanium.UI.createWindow({
		url: 'timeline_view.js',
	    title:"Everyone's Messages",
	    backgroundColor:'#2980b9', // #2980b9 for global, #e2620c for private, #16a085 for talk
	    timeline_type: 'global',
	    atmos: atmos
	});
	// win1.hideTabBar();
	var tab1 = Titanium.UI.createTab({  
		// icon: 'iphone/globe14.png',
	    title:"Everyone's Messages",
	    window:win1
	});
	
	var win2 = Titanium.UI.createWindow({  
		url: 'timeline_view.js',
	    title:'Messages for you',
	    backgroundColor:'#16a085',
	    timeline_type: 'talk',
	    atmos: atmos
	});
	var tab2 = Titanium.UI.createTab({  
		// icon: 'chat25.png',
	    title:'Messages for you',
	    window:win2
	});
	
	var win3 = Titanium.UI.createWindow({  
		url: 'timeline_view.js',
	    title:'Private Messages',
	    backgroundColor:'#e2620c',
	    timeline_type: 'private',
	    atmos: atmos
	});
	var tab3 = Titanium.UI.createTab({  
		// icon: 'mail21.png',
	    title:'Private Messages',
	    backgroundColor:'#e2620c',
	    window:win3
	});
	
	//
	//  add tabs
	//
	tabGroup.addTab(tab1);
	tabGroup.addTab(tab2);
	tabGroup.addTab(tab3);
	
	// open tab group
	tabGroup.open();
}
