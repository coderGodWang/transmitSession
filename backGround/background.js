var pool = [];
var messageSession = {};

//右键菜单
chrome.contextMenus.create({
	title: "获取session",
	onclick: function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			on(tabs[0].id);
		});
	}
});
chrome.contextMenus.create({
	title: "提供session",
	onclick: function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			readSession(tabs[0].id);
		});
	}
});
// 监听content-script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	let returnData = dealMessage(request);
	console.log(request, sender, sendResponse);
	sendResponse(returnData);
});

function dealMessage(request){
	let returnData = '';
	console.log('处理请求');
	switch(request.type){
		case 'on':on(request.message);break;
		case 'off':off(request.message);break;
		case 'publish':publish(request.message,request.id);break;
		case 'readSession':readSession(request.message);break;
		case 'getSessionKeys':returnData = Object.keys(sessionStorage);break;


		default:console.log('已接收！');
	}
	return returnData;
}
/*订阅*/
function on(message){
	console.log('已接收订阅！'+message);
	if(!pool.includes(message)){
		pool.push(message);
	}

	if(JSON.stringify(messageSession) != "{}"){
		chrome.tabs.sendMessage(message, messageSession);
	}
}

/*获取指定页面的session信息*/
function getSessionData(id) {
	var objectKeys = Object.keys(sessionStorage);
	if(objectKeys.indexOf(id)>-1){
		messageSession = sessionStorage.getItem(id);
	}
}

function off(message){console.log('已接收取消订阅！');}
function publish(message,id){
	messageSession = {type:'dealSessionData',message:message}
	sessionStorage.setItem(id,JSON.stringify({type:'dealSessionData',message:message}));
	pool.forEach(id => {
		chrome.tabs.sendMessage(id, {type:'dealSessionData',message:message});
	})
	console.log('已同步消息！');
}

function readSession(message){
	/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {type:'readSession',message:''});
	});*/
	chrome.tabs.sendMessage(message, {type:'readSession',message:message});
}


// function open_all_tab(){
// 	// 获取所有的页签
// 	chrome.tabs.getAllInWindow(null, function(tabs){
// 		for (var i = 0; i < tabs.length; i++) {
// 			// 在控制台打印出页签的tabid
// 			publisher.on(tabs[i].id);
// 			console.log(tabs[i].id);
// 			// 通过tabid向每一个页签发送消息
// 			chrome.tabs.sendMessage(tabs[i].id, {type: 'xxx'});
// 		}
// 	});
// }

// chrome.runtime.onInstalled.addListener(function(){
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
// 		chrome.declarativeContent.onPageChanged.addRules([
// 			{
// 				conditions: [
// 					// 只有打开百度才显示pageAction
// 					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'baidu.com'}})
// 				],
// 				actions: [new chrome.declarativeContent.ShowPageAction()]
// 			}
// 		]);
// 	});
// });
// chrome.runtime.onInstalled.addListener(function () {
// 	// storage中设置??
// 	chrome.storage.sync.set({ color: "#3aa757" }, function () {
// 	  console.log("storage init color value");
// 	});
// 	// 为特定的网址显示图标
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
// 	  chrome.declarativeContent.onPageChanged.addRules([
// 		{
// 		  conditions: [
// 			new chrome.declarativeContent.PageStateMatcher({
// 			  pageUrl: { hostEquals: "baidu.com" },
// 			}),
// 		  ],
// 		  actions: [new chrome.declarativeContent.ShowPageAction()],
// 		},
// 	  ]);
// 	});
//   });
