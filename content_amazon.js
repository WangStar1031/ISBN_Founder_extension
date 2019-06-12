console.log("received amazon tracking event++++++++++ ");
// when click 
var serverUrl = "https://rustic-royal.store/"

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    // var pageType = parseUrl(document.location.href);
    //console.log(msg, sendResponse, sender)
    if (msg.action == "startChecking") { 
        $.get(serverUrl + "getISBN.php", function (result) { 
            var isbns = JSON.parse(result)
            if (isbns.length) {
                //console.log(isbns[0],"first++++++++++++")
                chrome.storage.sync.set({ isbns: isbns });
                chrome.storage.sync.set({ Checking: true });
                location.href = "https://sellercentral.amazon.com/productsearch?q=" + isbns[0] + "&ref_=xx_prodsrch_cont_prodsrch"
                    
            } else {
                chrome.storage.sync.set({ Checking: false });
             }

        })
    }
    /* if (msg.action == "stopChecking") { 
        chrome.storage.sync.set({ Checking: false });

    } */
});



// end when click

chrome.storage.sync.get(['Checking', 'isbns'], function(result){
	if(result.Checking == true){
		checking(result.isbns)
	} else{
	}
})
// if checking == true

// checking()

function checking(isbns) {
    var str = location.href
    var res = str.split("https://sellercentral.amazon.com/productsearch?q=");
    var res1 = res[1].split("&ref_=xx_prodsrch_cont_prodsrch");
    //console.log(res1[0], "res1++++++")
    var currentIndex = 0;
    if ($('#a-autoid-2')) {
        console.log(res1[0],"ISBN+++++++++++++")
        $.post(serverUrl + "saveISBN.php", { ISBN: res1[0] }, function () { 
            currentIndex = isbns.indexOf(res1[0])
            //console.log(currentIndex)
            isbns.splice(currentIndex, 1)
            chrome.storage.sync.set({ isbns: isbns }, function () {
                location.href = "https://sellercentral.amazon.com/productsearch?q=" + isbns[currentIndex] + "&ref_=xx_prodsrch_cont_prodsrch"            
            });
            
        })
    }
    else {
        currentIndex = isbns.indexOf(res1[0])
        //console.log(currentIndex)
        isbns.splice(currentIndex, 1)
        chrome.storage.sync.set({ isbns: isbns }, function () {
            location.href = "https://sellercentral.amazon.com/productsearch?q=" + isbns[currentIndex] + "&ref_=xx_prodsrch_cont_prodsrch"
        });
        
    }

    
}







// storgage.get(isbns)    [0] => isbn => location.href -> 



// }