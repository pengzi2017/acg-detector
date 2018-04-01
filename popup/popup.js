// Get links from inject.js
function getLinks() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {content: "videolinks"}, (response) => {
            console.log(response);
            showLinks(response);
        });
    });
}

function showLinks(linksDict) {
    let links = document.getElementById("links");
    for (i in linksDict) {
        let a = document.createElement("a");
        let s = document.createTextNode(i);
        a.appendChild(s);
        a.setAttribute("href", linksDict[i]);
        a.setAttribute("target", "_blank");

        let li = document.createElement("li");
        li.appendChild(a);

        links.appendChild(li);
    }
}

if (document.readyState !== "loading") {
    getLinks();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        getLinks();
    })
}
