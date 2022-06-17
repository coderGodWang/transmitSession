var title ,id;
    // 先获取当前页面的tabID
    chrome.tabs.getSelected(null, function (tab) {
        title = tab.title;
        id = tab.id;

    });
     // 订阅
    document.getElementById('needUpdate').addEventListener('click', function()
    {
        sendMassage('on',id);
    });

    // 同步
    document.getElementById('update2Other').addEventListener('click', function()
    {
        sendMassage('readSession',id);
    });

    // 刷新
    document.getElementById('getSessionKeys').addEventListener('click', function()
    {
        sendMassage('getSessionKeys',id,fillRadio)
    });

    // 刷新
    document.getElementById('login').addEventListener('click', function()
    {

    });



    //向background.js发送消息
    function sendMassage(type,message,fn){
        chrome.runtime.sendMessage({
            type:type?type:"default",
            message:message,
        }, function (response) {
            fn&&fn(response);
            console.log("发送成功！");
        });
    }

    function fillRadio(sessionKeys){
        let html = ''
        sessionKeys.forEach(id => {
            html+= "<div class=\"div_radio\">\n" +
                "            <input type=\"radio\" name=\"sexradio\" value="+id+" id="+id+" />\n" +
                "            <label for="+id+" class=\"radio-label\">"+id+"</label>\n" +
                "        </div>";
        })
        document.getElementById("radio-id").innerHTML = html;

        /*绑定表格事件*/
    }




