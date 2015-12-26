$(document).ready(function(){
    var startUrl = chrome.extension.getURL('index.html');
    $('.btns .btn').on('click',function(){
        chrome.tabs.create({url: startUrl});
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function() {});
        });
        return false; 
    });
});