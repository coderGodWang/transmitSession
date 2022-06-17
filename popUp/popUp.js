var title ,currentPageId,pageId;
// 先获取当前页面的tabID
chrome.tabs.getSelected(null, function (tab) {
    title = tab.title;
    currentPageId = tab.id;
    document.getElementById('currentPageId').innerHTML = currentPageId;
    //document.getElementById('title').innerHTML = title;
});
document.getElementById('needUpdate').addEventListener('click', function()
{
    sendMassage("on",currentPageId);
});
document.getElementById('update2Other').addEventListener('click', function()
{
    sendMassage("readSession",currentPageId);
});


//向background.js发送消息
function sendMassage(type,message,fn){
    messageTemp = {
      type:type?type:"default",
      message:message,
    }
    chrome.runtime.sendMessage(messageTemp, fn?fn: function (response) {
      console.log("发送成功！");
    });
}
