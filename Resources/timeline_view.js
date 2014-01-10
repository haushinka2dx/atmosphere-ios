var win1 = Ti.UI.currentWindow;

var atmos = require('atmos');
var theme = require('theme');
var themeFGColorMain = theme.colorMain();
var themeFGColorSub = theme.colorSub();
var themeBGColor = theme.backgroundColor(win1.timeline_type);
var themeBGColorLight = theme.backgroundColorLight(win1.timeline_type);

var reloadButton = Ti.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
});
reloadButton.addEventListener('click', function(e) {
	refreshTimeline();
});
win1.leftNavButton = reloadButton;

function showSendMessageWindow(title, timelineType, replyToMsgId) {
	var messageWindow = Ti.UI.createWindow({
		url: 'message_window.js',
		title: title,
		color: themeFGColorMain,
		backgroundColor: themeBGColor,
		backgroundColorLight: themeBGColorLight,
		layout: 'vertical',
		isPrivate: timelineType === 'private',
		replyToMsgId: replyToMsgId
	});
	Ti.UI.currentTab.open(messageWindow);
}

var messageButton = Ti.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.ADD
});
messageButton.addEventListener('click', function(e) {
	showSendMessageWindow('new message', win1.timeline_type);
});
win1.rightNavButton = messageButton;

var tableView = Ti.UI.createTableView({
	data: []
});

var latestMessageCreatedAt = undefined;
var oldestMessageCreatedAt = undefined;

function judgeMessageStatus(createdAt) {
	if (latestMessageCreatedAt && createdAt <= latestMessageCreatedAt && oldestMessageCreatedAt && createdAt >= oldestMessageCreatedAt) {
		return 'exists';
	}
	else if (!latestMessageCreatedAt || createdAt > latestMessageCreatedAt) {
		return 'newer';
	}
	else {
		return 'older';
	}
}

function setCreatedAt(createdAt) {
	if (!latestMessageCreatedAt || createdAt > latestMessageCreatedAt) {
		latestMessageCreatedAt = createdAt;
	}
	if (!oldestMessageCreatedAt || createdAt < oldestMessageCreatedAt) {
		oldestMessageCreatedAt = createdAt;
	}
}

var timelineData = [];
var timelineMetaData = {};
function updateTimeline(timeline) {
	var heads = [];
	var tails = [];
	timeline.forEach(function(tlItem, i, a) {
		var createdAtUtc = new Date(tlItem['created_at']);
		var newMessageStatus = judgeMessageStatus(createdAtUtc);
		if (newMessageStatus != 'exists') {
			var row = Ti.UI.createTableViewRow({
				//height: 150,
				height: 'auto',
				layout: 'vertical',
				backgroundColor: themeBGColor
			});
			
			var imageView = Ti.UI.createImageView({
				image: atmos.getAvatorUrl(tlItem['created_by']),
				width: 48,
				height: 48,
				left: 5,
				top: 5
			});
			row.add(imageView);
			
			var nameLabel = Ti.UI.createLabel({
				width: 120,
	//			height: 12,
				height: 'auto',
				left: 58,
				top: -48,
				fontSize: 6,
				fontWeight: 'bold',
				color: themeFGColorSub
			});
			nameLabel.text = tlItem['created_by'];
			row.add(nameLabel);
					
			var commentLabel = Ti.UI.createLabel({
				width: 257,
	//			height: 100,
				height: 'auto',
				left: 58,
				top: 1,
				fontSize: 8,
				color: themeFGColorMain
			});
			commentLabel.text = tlItem.message;
			row.add(commentLabel);
	
			var dateLabel = Ti.UI.createLabel({
				width: 257,
	//			height: 12,
				height: 'auto',
				left: 58,
				top: 5,
				fontSize: 4,
				color: themeFGColorSub
			});
			//var createdAtUtc = new Date(tlItem['created_at']);
			dateLabel.text = String.formatDate(createdAtUtc, 'medium') + ' ' + String.formatTime(createdAtUtc, 'medium');
			row.add(dateLabel);
			
			var replyButton = Ti.UI.createButton({
				width: 'auto',
				height: 'auto',
				left: 58,
				top: 2,
				color: themeFGColorSub,
				title: 'reply'
			});
			var replyHandler = (function() {
				var sourceMsgId = tlItem['_id'];
				return function(e) {
					var orgMsg = timelineMetaData[sourceMsgId];
					showSendMessageWindow('reply message', win1.timeline_type, orgMsg['_id']);
				};
			})();
			replyButton.addEventListener('click', replyHandler);
			row.add(replyButton);
			
			if (newMessageStatus === 'newer') {
				heads.push(row);
			}
			else {
				tails.push(row);
			}
			setCreatedAt(createdAtUtc);
			
			timelineMetaData[tlItem['_id']] = tlItem;
		}
	});
	var nextData = heads.concat(timelineData);
	nextData = nextData.concat(tails);
	tableView.setData(nextData);
	
	timelineData = nextData;
}

win1.add(tableView);

function refreshTimeline() {
	// var atmos = require('atmos');
	var resultApplier = function(e) {
		var resJSON = JSON.parse(e.source.responseText);
		updateTimeline(resJSON.results);
	};
	if (win1.timeline_type === 'global') {
		atmos.getGlobalTimeline(resultApplier);
	}
	else if (win1.timeline_type === 'talk') {
		atmos.getTalkTimeline(resultApplier);
	}
	else if (win1.timeline_type === 'private') {
		atmos.getPrivateTimeline(resultApplier);
	}
}

refreshTimeline();
