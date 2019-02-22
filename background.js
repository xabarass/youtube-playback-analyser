function handleMessage(message, sender, sendResponse) {
	reportMetrics(message)
}

browser.runtime.onMessage.addListener(handleMessage)

function reportMetrics(metrics){
	$.ajax({
		url: "http://localhost:3000/upload-metrics",
		method: "POST",
		data: metrics
	})
	.done(function (data) {
		console.log(data)
	})
	.fail(function(){
		console.log("Failed to send request")
	})
}

var i=1
setInterval(function(){
	i++
	console.log("HELLOOO "+i)
}, 1000)

