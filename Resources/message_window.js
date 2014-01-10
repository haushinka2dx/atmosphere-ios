var win = Ti.UI.currentWindow;

var backButton = Ti.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.CANCEL
});
backButton.addEventListener('click', function(e) {
	win.close();
});
win.leftNavButton = backButton;

if (win.isPrivate) {
	var addressesTextArea = Ti.UI.createTextArea({
		width: 300,
		height: 30,
		top: 20,
	    font: {fontSize: 20},
		color: win.color,
		backgroundColor: win.backgroundColorLight,
		hintText: 'Input addresses e.g. @bob @john'
	});
	win.add(addressesTextArea);
}

var messageTextArea = Ti.UI.createTextArea({
	width: 300,
	height: 150,
	top: 20,
	font: {fontSize: 20},
	color: win.color,
	backgroundColor: win.backgroundColorLight,
});
win.add(messageTextArea);

var postButton = Ti.UI.createButton({
	top: 10,
	right: 10,
	width: 100,
	height: 44,
	color: win.color,
	backgroundColor: win.backgroundColor,
	title: 'SEND'
});

var atmos = require('atmos');
if (win.isPrivate) {
	var postAction = function(e) {
		if (addressesTextArea.value && messageTextArea.value) {
			atmos.sendPrivateMessage(
				addressesTextArea.value,
				messageTextArea.value,
				win.replyToMsgId,
				function(e) { win.close(); },
				function(e) { alert('failed to send message'); }
			);
		}
		else {
			alert('address and message is required.');
		}
	};
}
else {
	var postAction = function(e) {
		if (messageTextArea.value) {
			atmos.sendMessage(
				messageTextArea.value,
				win.replyToMsgId,
				function(e) {
					win.close();
				}
			);
		}
		else {
			alert('message is required.');
		}
	};
}
postButton.addEventListener('click', postAction);

win.add(postButton);
