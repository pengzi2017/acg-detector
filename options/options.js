function initPage() {
    //Default choice
    document.getElementsByName("replace")[0].click();
    document.getElementById("saveBtn").addEventListener("click", () => {
        let status = document.getElementById("saveStatus");
        status.style.opacity = 1;
        setTimeout(function () {
            status.style.opacity = 0
        }, 1500);

        let option = document.querySelector('input[name="replace"]:checked').value;
        chrome.storage.local.set({replace: option}, function (result) {
        });
    });
}

initPage();