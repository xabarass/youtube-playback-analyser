setInterval(function(){
		nerdStats = $(".html5-video-info-panel-content").children('div')
		if (nerdStats.length==0){
			return
		}
	
		var stats = []
		for (var i=0; i < nerdStats.length; i++){
			stats.push(nerdStats[i].innerText)
		}

		buttonStat = $(".ytp-play-button")[0].title
		currentTime = $(".ytp-time-current")[0].innerText
		totalTime = $(".ytp-time-duration")[0].innerText

		var metrics = {
			stats:stats,
			btn:buttonStat,
			currentTime:currentTime,
			totalTime:totalTime,
			timestamp:new Date()
		}

		logStats(metrics)

}, 250)

function logStats(data){
    browser.runtime.sendMessage(data).then(function(){
	console.log("Sent")
    });  
}

