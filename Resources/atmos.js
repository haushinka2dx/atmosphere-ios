var atmosSessionIdKey = 'atmosphere-session-id';
var atmosSessionId = undefined;
var urlBase = 'http://localhost/atmos/';

exports.whoami = function(onsuccess, onfailure) {
	sendRequest(urlBase + 'auth/whoami', 'GET', undefined, onsuccess, onfailure);
};

exports.login = function(userId, password, onsuccess, onfailure) {
	var data = {'user_id':userId, 'password':password};
	sendRequest(urlBase + 'auth/login', 'POST', data, onsuccess, onfailure);
};

exports.getGlobalTimeline = function(onsuccess, onfailure) {
	sendRequest(urlBase + 'messages/global_timeline', 'GET', undefined, onsuccess, onfailure);	
};

exports.getTalkTimeline = function(onsuccess, onfailure) {
	sendRequest(urlBase + 'messages/talk_timeline', 'GET', undefined, onsuccess, onfailure);
};

exports.getPrivateTimeline = function(onsuccess, onfailure) {
	sendRequest(urlBase + 'private/timeline', 'GET', undefined, onsuccess, onfailure);
};

exports.sendMessage = function(message, onsuccess, onfailure) {
	var data = {'message':message};
	sendRequest(urlBase + 'messages/send', 'POST', data, onsuccess, onfailure);
};

exports.sendPrivateMessage = function(addressUsers, message, onsuccess, onfailure) {
	var data = {'to_user_id': addressUsers, 'message':message};
	sendRequest(urlBase + 'private/send', 'POST', data, onsuccess, onfailure);
};

exports.getAvatorUrl = function(userId) {
	return urlBase + 'user/avator?user_id=' + userId;
};

function sendRequest(url, method, data, callbackOnSuccess, callbackOnFailure) {
	var xhr = Ti.Network.createHTTPClient();
	xhr.setRequestHeader(atmosSessionIdKey, atmosSessionId);
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