window.onload = function () { 
    
    //zenarbitrage.com/////
    var btnComment = document.getElementById('start_button');
    btnComment.onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startScrapping"});
        });
    };
   /*  var btnComment = document.getElementById('stop_button');
    btnComment.onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stopScrapping"});
        });
    }; */

    var btnComment = document.getElementById('stop_button');
    btnComment.onclick = function () {
        chrome.storage.sync.set({ Scrapping: false });

    };

    //sellercentral.amazon.com//

    var btnComment = document.getElementById('start_button_amazon');
    btnComment.onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startChecking"});
        });
    };
    var btnComment = document.getElementById('stop_button_amazon');
    btnComment.onclick = function () {
        chrome.storage.sync.set({ Checking: false });

    };

    //bookfinder.com///

    var btnComment = document.getElementById('start_button_bookfinder');
    btnComment.onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "bookfinderChecking"});
        });
    };
    var btnComment = document.getElementById('stop_button_bookfinder');
    btnComment.onclick = function () {
        chrome.storage.sync.set({ bookfinder_Checking: false });

    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        
        if (tabs[0].url.includes('bookfinder.com')) {
            console.log(tabs[0].url.includes('bookfinder.com'), "Is on bookfinder ")
            $(".lastDiv").hide();
            $(".lastDiv1").hide();
            $(".lastDiv2").show();
            $(".lastDiv3").hide();
        
        } else if (tabs[0].url.includes('zenarbitrage.com')) {
            console.log(tabs[0].url.includes('zenarbitrage.com'), "Is on  ")
            $(".lastDiv").show();
            $(".lastDiv1").hide();
            $(".lastDiv2").hide();
            $(".lastDiv3").hide();
        
        } else if (tabs[0].url.includes('sellercentral.amazon.com')) {
            console.log(tabs[0].url.includes('sellercentral.amazon.com'), "Is on  ")
            $(".lastDiv").hide();
            $(".lastDiv1").show();
            $(".lastDiv2").hide();
            $(".lastDiv3").hide();
        
        } else { 
            $(".lastDiv").hide();
            $(".lastDiv1").hide();
            $(".lastDiv2").hide();
            $(".lastDiv3").show();
        }
    });
};
