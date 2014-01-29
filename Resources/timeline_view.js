var win1 = Ti.UI.currentWindow;

var maxCount = 20;
var utils = require('utils');
var atmos = win1.atmos;
var currentUserId = atmos.currentUserId();
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

function showSendMessageWindow(title, timelineType, replyToMsgId, toUserIds) {
	var messageWindow = Ti.UI.createWindow({
		url: 'message_window.js',
		title: title,
		color: themeFGColorMain,
		backgroundColor: themeBGColor,
		backgroundColorLight: themeBGColorLight,
		layout: 'vertical',
		isPrivate: timelineType === 'private',
		replyToMsgId: replyToMsgId,
		toUserIds: toUserIds,
		atmos: atmos
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

var tableFooter = Ti.UI.createView({
	height: '36',
	layout: 'vertical',
	backgroundColor: themeBGColor
});

var readMoreButton = Ti.UI.createButton({
	width: 320,
	height: 'auto',
	left: 0,
	top: 2,
	color: themeFGColorSub,
	backgroundColor: themeBGColorLight,
	title: "read more",
	textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER
});
readMoreButton.addEventListener('click', readMoreTimeline);
tableFooter.add(readMoreButton);
tableView.footerView = tableFooter;

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
				width: 257,
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
				width: 180,
	//			height: 12,
				height: 'auto',
				right: 0,
				top: 5,
				font: {fontSize: 1},
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
				backgroundImage: 'reply_s.png'
			});
			var replyHandler = (function() {
				var sourceMsgId = tlItem['_id'];
				if (tlItem['to_user_id']) { // for private
					var toUserIds = tlItem['to_user_id'];
				}
				if (tlItem['addresses'] && tlItem['addresses']['users']) {
					var toUserIds = tlItem['addresses']['users'];
				}
				if (toUserIds) {
					var createdBy = tlItem['created_by'];
					var addressesUsers = [];
					toUserIds.forEach(function(userId, i, a) { if (userId !== currentUserId) { addressesUsers.push(userId); } });
					if (createdBy !== currentUserId && addressesUsers.indexOf(createdBy) === -1) {
						addressesUsers.push(createdBy);
					}
				}
				return function(e) {
					var orgMsg = timelineMetaData[sourceMsgId];
					showSendMessageWindow('reply message', win1.timeline_type, orgMsg['_id'], addressesUsers);
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
			
			timelineMetaData[tlItem['_id']] = tlItem;
		}
	});
	timeline.forEach(function(tlItem, i, a) {
		setCreatedAt(new Date(tlItem['created_at']));
	});
	
	var nextData = heads.concat(timelineData);
	nextData = nextData.concat(tails);
	tableView.setData(nextData);
	
	timelineData = nextData;
}

// pull to refresh--
function formatDate(){
    var date = new Date;
    var datestr = (date.getMonth() + 1) +'/'+date.getDate()+'/'+date.getFullYear();
    if (date.getHours()>=12){
       datestr+=' '+(date.getHours()==12 ? 
          date.getHours() : date.getHours()-12)+':'+
          date.getMinutes()+' PM';
    }
    else{
        datestr+=' '+date.getHours()+':'+date.getMinutes()+' AM';
    }
    return datestr;
}
var pulling = false;
var reloading = false;
var refreshHeaderTheme = theme.pullToRefreshTableHeader(formatDate());
var border = Ti.UI.createView(refreshHeaderTheme.border);
var tableHeader = Ti.UI.createView(refreshHeaderTheme.tableHeader);
tableHeader.add(border);
var arrow = Ti.UI.createView(refreshHeaderTheme.arrow);
var statusLabel = Ti.UI.createLabel(refreshHeaderTheme.statusLabel);
var lastUpdatedLabel = Ti.UI.createLabel(refreshHeaderTheme.lastUpdatedLabel);
var actInd = Titanium.UI.createActivityIndicator(refreshHeaderTheme.actInd);


tableHeader.add(arrow);
tableHeader.add(statusLabel);
tableHeader.add(lastUpdatedLabel);
tableHeader.add(actInd);
tableView.headerPullView = tableHeader;

win1.add(tableView);

tableView.beginReloading = function(){
    refreshTimeline();
};

function endReloading(success){
    tableView.setContentInsets({top:0},{animated:true});
    reloading = false;
    if(success){
        lastUpdatedLabel.text = "Last Updated: "+formatDate();
    }
    statusLabel.text = "Pull down to refresh...";
    actInd.hide();
    arrow.show();
};

tableView.addEventListener('scroll', function(e) {
    var offset = e.contentOffset.y;
    if (offset <= -65.0 && !pulling) {
        var t = Ti.UI.create2DMatrix();
        t = t.rotate(-180);
        pulling = true;
        arrow.animate({
            transform : t,
            duration : 180
        });
        statusLabel.text = "Release to refresh...";
    } else if (pulling && offset > -65.0 && offset < 0) {
        pulling = false;
        var t = Ti.UI.create2DMatrix();
        arrow.animate({
            transform : t,
            duration : 180
        });
        statusLabel.text = "Pull down to refresh...";
    }
});

tableView.addEventListener('dragEnd', function() {
    if (pulling && !reloading) {
        reloading = true;
        pulling = false;
        arrow.hide();
        actInd.show();
        statusLabel.text = "Reloading...";
        tableView.setContentInsets({
            top : 60
        }, {
            animated : true
        });

        tableView.scrollToTop(-60, true);
        arrow.transform = Ti.UI.create2DMatrix();
        tableView.beginReloading();
    }
});
// --pull to refresh

function refreshTimeline() {
	var resultApplier = function(e) {
		var resJSON = JSON.parse(e.source.responseText);
		updateTimeline(resJSON.results);
	};
	
	var options = {};
	options['count'] = maxCount;
	if (latestMessageCreatedAt) {
		options['future_than'] = utils.toUtcDateTimeString(latestMessageCreatedAt);
	}
	getTimelineRefresher(win1.timeline_type)(options, resultApplier);
	
    endReloading(true);
}

function readMoreTimeline() {
	var resultApplier = function(e) {
		var resJSON = JSON.parse(e.source.responseText);
		updateTimeline(resJSON.results);
	};
	
	var options = {};
	options['count'] = maxCount;
	if (oldestMessageCreatedAt) {
		options['past_than'] = utils.toUtcDateTimeString(oldestMessageCreatedAt);
	}
	getTimelineRefresher(win1.timeline_type)(options, resultApplier);
}

function getTimelineRefresher(timelineType) {
	if (timelineType === 'global') {
		return atmos.getGlobalTimeline;
	}
	else if (timelineType === 'talk') {
		return atmos.getTalkTimeline;
	}
	else if (timelineType === 'private') {
		return atmos.getPrivateTimeline;
	}
	else {
		return undefined;
	}
}

refreshTimeline();
