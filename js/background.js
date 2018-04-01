/*
A suitable assignment for beginners:
https://github.com/dyweb/mos/issues/26#issuecomment-377671983
 */

// Mapping code to website&url
// Background and inject JS can not share their variables.
var linkMap = new Array();
linkMap["av"] = ["bilibili", "http://www.bilibili.com/video/av"];
linkMap["ac"] = ["acfun", "http://www.acfun.cn/v/ac"];
linkMap["sm"] = ["niconico", "http://www.nicovideo.jp/watch/sm"];
linkMap["pixiv"] = ["pixiv", "https://www.pixiv.net/member_illust.php?mode=medium&illust_id="];

// Create menus for right click
chrome.contextMenus.create({
    'type': 'normal',
    'title': 'Go to watch...',
    'contexts': ['selection'],
    'id': 'goto',
    'onclick': goToVideo
});

// Open the page of the video
function goToVideo(info, tab) {
    let site = info.selectionText.match(/^[a-z]+/gi)[0].toLowerCase();
    let code = info.selectionText.match(/\d+$/)[0];
    let url = linkMap[site][1] + code;
    window.open(url, '_blank');
}

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (typeof message) {
            case "string":
                console.log(message);
                let site = message.match(/^[a-z]+/gi)[0].toLowerCase();
                chrome.contextMenus.update('goto', {
                    "title": "Go to " + linkMap[site][0] + "/" + message
                    //
                });
                break;
            default:
                console.log("Unrecognized message...");
        }
    }
);