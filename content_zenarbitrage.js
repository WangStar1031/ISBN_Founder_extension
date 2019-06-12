console.log("received tracking event++++++++++ ");

var serverUrl = "https://rustic-royal.store/"

 

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    // var pageType = parseUrl(document.location.href);
    console.log(msg, sendResponse, sender)
    if (msg.action == "startScrapping") { 
        console.log()
        // save stroage
        $('#new-filter')
        chrome.storage.sync.set({
            Scrapping: true
        }, function () {
           
        });

        //location.href = "https://fba.zenarbitrage.com/?page=1&saved_search=&textbooks_only=false"
        startScrapping()
    }
    /* if (msg.action == "stopScrapping") { 
        chrome.storage.sync.set({
            Scrapping: false
        }, function () {
        });

    } */
});

// get storage
// if there is "scrapping"
//startScrapping()


chrome.storage.sync.get(['Scrapping'], function(result) {
    if (result.Scrapping && result.Scrapping == true) {
        startScrapping()
    }
  });


function checkLoad() {
    var isChecked = true
    $("#table tbody tr").each(function () { 
        // console.log($(this).find("td:eq( 5 ) .fba-price").length)
        if ($(this).find("td:eq( 5 ) .fba-price").length) { 
            isChecked = false
        }
    })
    return isChecked
}

function startScrapping() {
    if (checkLoad() == true) {
        var scraped_data = []
        $("#table tbody tr").each(function () {
            var rowObject = new Object()
            rowObject.ISBN = $(this).find("td:eq( 0 ) a ").text().replace(/(^[ \t]*\n)/gm, "").trim()
            rowObject.Title = $(this).find("td:eq( 1 ) strong ").text().replace(/(^[ \t]*\n)/gm, "").trim()
            rowObject.Used = $(this).find("td:eq( 2 ) a ").text().replace(/(^[ \t]*\n)/gm, "").trim()
            rowObject.New = $(this).find("td:eq( 3 ) a ").text().replace(/(^[ \t]*\n)/gm, "").trim()
            rowObject.Amazon = $(this).find("td:eq( 4 ) a ").text().replace(/(^[ \t]*\n)/gm, "").trim()
            rowObject.FBA = $(this).find("td:eq( 5 ) a ") ? $(this).find("td:eq( 5 ) a ").text().replace(/(^[ \t]*\n)/gm, "").trim() : ""
            rowObject.Used1 = $(this).find("td:eq( 6 )").text().replace(/(^[ \t]*\n)/gm, "").trim()
            rowObject.New1 = $(this).find("td:eq( 7 )").text().replace(/(^[ \t]*\n)/gm, "").trim()
            rowObject.Avg = $(this).find("td:eq( 8 ) a ").text().replace(/(^[ \t]*\n)/gm, "").trim()
            scraped_data.push(rowObject)
            console.log("+++_+_+_+_+_")
        })
        console.log(scraped_data, "+++++++++++++++++++++++++++++++++++")
        $.post(serverUrl + "saveData.php", { data: scraped_data }, function () {
            if ($("span.next")) {
                document.querySelector(".next a").click()
            }
            else {
                // remove storage
                chrome.storage.sync.set({
                    Scrapping: false
                }, function () {
                        
                        
                        
                });
                
    
    
            }
        })
    }
    else { 
        setTimeout(startScrapping, 1000)
    }
    
}