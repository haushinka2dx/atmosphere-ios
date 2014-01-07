var win = Ti.UI.currentWindow;

var guidanceLabel = Ti.UI.createLabel({
	width: 300,
	height: 'auto',
	top: 30,
	left: 10,
	color: win.color,
	text: 'Welcome to Atmos'
});
win.add(guidanceLabel);

var userIdTextField = Ti.UI.createTextField({
	width: 300,
	height: 'auto',
	top: 5,
	left: 10,
	font: {fontSize: 20},
	color: win.color,
	backgroundColor: win.backgroundColorLight,
	hintText: 'user id'
});
win.add(userIdTextField);

var passwordTextField = Ti.UI.createTextField({
	width: 300,
	height: 'auto',
	top: 5,
	left: 10,
	font: {fontSize: 20},
	color: win.color,
	backgroundColor: win.backgroundColorLight,
	hintText: 'password',
	passwordMask: true
});
win.add(passwordTextField);

var postButton = Ti.UI.createButton({
	right: 10,
	width: 'auto',
	height: 44,
	color: win.color,
	backgroundColor: win.backgroundColor,
	title: 'Sign In'
});

var atmos = require('atmos');
postButton.addEventListener('click', function(e) {
	atmos.login(
		userIdTextField.value,
		passwordTextField.value,
		function(e) {
			var resJSON = JSON.parse(e.source.responseText);
			if (resJSON.status === 'login successful') {
				win.close();
				win.onsuccess();
			}
			else {
				alert('user id or password are wrong');
			}
		},
		function(e) {
			alert('user id or password are wrong');
		}
	);
});

win.add(postButton);
