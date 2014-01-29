var atmosSessionIdKey = 'atmosphere-session-id';
var atmosSessionId = undefined;
var urlBase = 'http://localhost/atmos/';
var currentUserId = undefined;

exports.currentUserId = function(userId) {
	if (typeof(userId) !== 'undefined' && userId != null && userId.length > 0) {
		currentUserId = userId;
	}
	return currentUserId;
};

exports.whoami = function(onsuccess, onfailure) {
	sendRequest(urlBase + 'auth/whoami', 'GET', undefined, onsuccess, onfailure);
};

exports.login = function(userId, password, onsuccess, onfailure) {
	var data = {'user_id':userId, 'password':password};
	sendRequest(urlBase + 'auth/login', 'POST', data, onsuccess, onfailure);
};

exports.getGlobalTimeline = function(options, onsuccess, onfailure) {
	sendRequest(urlBase + 'messages/global_timeline', 'GET', options, onsuccess, onfailure);	
};

exports.getTalkTimeline = function(options, onsuccess, onfailure) {
	sendRequest(urlBase + 'messages/talk_timeline', 'GET', options, onsuccess, onfailure);
};

exports.getPrivateTimeline = function(options, onsuccess, onfailure) {
	sendRequest(urlBase + 'private/timeline', 'GET', options, onsuccess, onfailure);
};

exports.sendMessage = function(message, replyToMsgId, onsuccess, onfailure) {
	var data = {'message':message, 'reply_to':replyToMsgId};
	sendRequest(urlBase + 'messages/send', 'POST', data, onsuccess, onfailure);
};

exports.sendPrivateMessage = function(addressUsers, message, replyToMsgId, onsuccess, onfailure) {
	var data = {'to_user_id': addressUsers, 'message':message, 'reply_to':replyToMsgId};
	sendRequest(urlBase + 'private/send', 'POST', data, onsuccess, onfailure);
};

exports.getAvatorUrl = function(userId) {
	return urlBase + 'user/avator?user_id=' + userId;
};

function sendRequest(url, method, data, callbackOnSuccess, callbackOnFailure) {
	var xhr = Ti.Network.createHTTPClient();
	xhr.setRequestHeader(atmosSessionIdKey, atmosSessionId);
	if (method === 'GET' && data) {
		var params = [];
		Object.keys(data).forEach(function(key, i, a) {
			params.push(key + '=' + data[key]);
		});
		if (params.length > 0) {
			url = url + '?' + params.join('&');
		}
	}
	xhr.open(method, url);
	xhr.onload = function(e) {
		Ti.API.info(e.source.responseText);
		var sessionId = xhr.getResponseHeader(atmosSessionIdKey);
		if (sessionId) {
			atmosSessionId = sessionId;
		}
		if (callbackOnSuccess) {
			callbackOnSuccess(e);
		}
	};
	xhr.onerror = function(e) {
		Ti.API.info(e);
		if (callbackOnFailure) {
			callbackOnFailure(e);
		}
	};
	if (method === 'POST' && data) {
		xhr.send(JSON.stringify(data));
	}
	else {
		xhr.send();
	}
}