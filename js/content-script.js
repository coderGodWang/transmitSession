var currentPageId = '0';
//向background.js发送消息
function sendMassage(type,message,fn){
  messageTemp = {
    type:type?type:"default",
    message:message,
    id:currentPageId
  }
  chrome.runtime.sendMessage(messageTemp, function (response) {
    fn?fn(response):console.log("发送成功！");
  });
}

//接收来自background.js消息
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse){
    switch(request.type){
      case 'dealSessionData':dealSessionData(request.message);break;
      case 'readSession':readSession(request.message);break;

    }
  }
  // onMessage 返回 true 时候 sendResponse 就可以写在异步当中了
  //return true;
)

//写入缓存
function dealSessionData(sessionData){
  var objectKeys = Object.keys(sessionData);
  objectKeys.forEach(key => {
    sessionStorage.setItem(key,sessionData[key]);
  })
  console.log("插入缓存 成功")
}

//读取缓存
function readSession(idTemp){
  currentPageId = idTemp;
  var objectKeys = Object.keys(sessionStorage);
  var sessionData = {};
  objectKeys.forEach(key => {
    sessionData[key] = sessionStorage.getItem(key);
  })
  console.log('获取缓存')
  setTimeout( function(){
    sendMassage('publish',sessionData);
    }, 2 * 1000 );
}



