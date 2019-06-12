console.log("received bookfinder tracking event++++++++++ ");
// when click 
var serverUrl = "https://rustic-royal.store/"
function arrayLimitation( arrInput){
    var maxCount = 50;
    var arrReturn = [];
    for( var i = 0; i < arrInput.length; i++){
        if( i >= maxCount) break;
        arrReturn.push( arrInput[i]);
    }
    return arrReturn;
}
chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action == "bookfinderChecking") { 
        $.get(serverUrl + "getISBN.php", function (result) { 
            var isbns = JSON.parse(result)
            if (isbns.length) {
                //console.log(isbns[0],"first++++++++++++")
                chrome.storage.sync.set({ bookfinder_isbns: arrayLimitation(isbns), bookfinder_Checking: true, currentISBN: isbns[0] });
                setTimeout( function(){
                    chrome.storage.sync.get(["bookfinder_Checking", "bookfinder_isbns", "currentISBN"], function(result){
                        console.log( result.bookfinder_Checking);
                        if( result.bookfinder_Checking == true)
                            location.href = "https://www.bookfinder.com/search/?keywords=" + isbns[0] + "&currency=USD&destination=us&mode=basic&lang=en&st=sh&ac=qr&submit="
                    });
                }, 1000)
                
            } else { 
                chrome.storage.sync.set({ bookfinder_Checking: false });
            }
        })
    }
});



// end when click

chrome.storage.sync.get(["bookfinder_Checking", "bookfinder_isbns", "currentISBN"], function(result){
	if(result.bookfinder_Checking == true){
        if( result.bookfinder_isbns.length ){
    		checking(result.bookfinder_isbns, result.currentISBN)
        } else{
            $.get(serverUrl + "getISBN.php", function (result) { 
                var isbns = JSON.parse(result)
                if (isbns.length) {
                    chrome.storage.sync.set({ bookfinder_isbns: arrayLimitation(isbns), currentISBN: isbns[0] });
                    setTimeout( function(){
                        chrome.storage.sync.get(["bookfinder_Checking", "bookfinder_isbns", "currentISBN"], function(result){
                            console.log( result.bookfinder_Checking);
                            if( result.bookfinder_Checking == true)
                                location.href = "https://www.bookfinder.com/search/?keywords=" + isbns[0] + "&currency=USD&destination=us&mode=basic&lang=en&st=sh&ac=qr&submit="
                        });
                    }, 1000)
                    
                } else { 
                    chrome.storage.sync.set({ bookfinder_Checking: false });
                }
            })  
        }
	} else{
	}
})
// if checking == true

// checking()

function checking(bookfinder_isbns, currentISBN) {
    //console.log(currentISBN, "Current ISBN")
    var str = location.href
    // var res = str.split("https://www.bookfinder.com/search/?author=&title=&lang=en&isbn=");
    // var res1 = res[1].split("&new_used=*&destination=ru&currency=USD&mode=basic&st=sr&ac=qr");
    var table = $(".results-table-Logo").length == 2 ? $(".results-table-Logo:eq(1)") : $(".results-table-Logo")
    //console.log(table)

    var result_price=[]
    table.find("tbody").find("tr").each(function () {
        //console.log($(this))
        
        var rowObject = new Object()
        rowObject.price = $(this).find("td:eq( 3 ) a ").text()
        var res = rowObject.price.replace("$","").replace(",",".");
        //console.log(res)
        if (res) { 
            var price = parseFloat(res)
            result_price.push(price)
        }
    })
    var next = table.find("tbody").find("tr").find("th").find("strong").find("a:contains(NEXT)")
    chrome.storage.sync.get(['result_price'], function(result){
        var prices = result.result_price
        if (prices) {
            prices = prices.concat(result_price)
                       
        }
        else {
            prices = result_price
        }
        chrome.storage.sync.set({ result_price: prices }, function () {
            

            if (next.attr("href")) {
                 location.href = next.attr("href")
            } else { 

                var min = Math.min(...prices)
                var max = Math.max(...prices)
                console.log(min, max)
                $.post(serverUrl + "saveprice.php", { ISBN: currentISBN, min: min, max:max }, function () { 
                        // remove storage
                    currentIndex = bookfinder_isbns.indexOf(currentISBN)
                    //console.log(currentIndex)
                    //console.log(currentIndex)
                    bookfinder_isbns.splice(currentIndex, 1)
                    currentISBN = bookfinder_isbns[0]
                    //console.log(bookfinder_isbns.splice(currentIndex, 1))
                    chrome.storage.sync.set({ result_price: [], currentISBN: currentISBN,bookfinder_isbns : bookfinder_isbns }, function () {
                        location.href = "https://www.bookfinder.com/search/?keywords=" + currentISBN + "&currency=USD&destination=us&mode=basic&lang=en&st=sh&ac=qr&submit="            
                    });  
                })

                      
            }
        
        })

    })
   
    
}

