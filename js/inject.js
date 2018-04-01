/*
This script will be injected in the current page.
 */

// Mapping code to website&url
// Background and inject JS can not share their variables.
var linkMap = new Array();
linkMap["av"] = ["bilibili", "http://www.bilibili.com/video/av"];
linkMap["ac"] = ["acfun", "http://www.acfun.cn/v/ac"];
linkMap["sm"] = ["niconico", "http://www.nicovideo.jp/watch/sm"];
linkMap["pixiv"] = ["pixiv", "https://www.pixiv.net/member_illust.php?mode=medium&illust_id="];

// Get selected text
window.onmouseup = function () {
    let selection = window.getSelection();
    if (selection.anchorOffset != selection.extentOffset) {
        chrome.runtime.sendMessage(selection.toString());
    }
};

// Get video links from text such as "av1234"
function genetateLinks() {
    pageBody = document.body.innerHTML;
    // If ">"or"/"is found before "av1234"(for example), it might be a link and will be dismissed.
    // Limit the video number,1-10 digits...
    let re = new RegExp('(?<!(\\>|\\/))((ac)|(pixiv)|(av)|(sm))\\d{5,10}','gi');
    videoInfoArray = pageBody.match(re);
    console.log(videoInfoArray);
    // Set: no duplication
    videoInfoSet = new Set(videoInfoArray);
    videoInfoDict = {};
    videoInfoSet.forEach(function (e) {
        let site = e.match(/^[a-z]+/gi)[0].toLowerCase();
        let code = e.match(/\d+$/)[0];
        videoInfoDict[e.toLowerCase()] = linkMap[site][1] + code;
    });
    return videoInfoDict
}

// Change all texts like "av1234" to href form
function changeToLinks(linksDict) {
    for (e in linksDict) {
        let re = new RegExp(e, "g");
        let link = "<a href={0} target='_blank'>{1}</a>".format(linksDict[e], e);
        pageBody = pageBody.replace(re, link);
    }
    document.body.innerHTML = pageBody;
}

// Send links Dict to popup.js -> popup.html
function sendLinksToPopup(linksDict) {
    chrome.runtime.onMessage.addListener(
        function (message, sender, sendResponse) {
            switch (message.content) {
                case "videolinks":
                    sendResponse(linksDict);
                    break;
                default:
                    console.log('Unrecognized message...');
            }
        }
    )
}

function main() {
    // Get options first
    chrome.storage.local.get(null, (options) => {
        switch (options["replace"]) {
            case "off":
                break;
            default:
                changeToLinks(genetateLinks());
        }
    });

    sendLinksToPopup(genetateLinks());
}

if (document.readyState !== "loading") {
    main();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        main();
    })
}
