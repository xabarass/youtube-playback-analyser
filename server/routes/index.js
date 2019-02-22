var express = require('express');
var router = express.Router();
var fs = require('fs')
var cmd = require('node-cmd')

var timings = require('./timings.js')

function setBandwidth(newBw){
	lastBw = newBw
	console.log("Setting bw to "+newBw)
	cmd.run('sudo /home/milan/wondershaper/update.sh '+newBw+' 512')
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var lastBw = 0
var timingIndex = 0
var fullList = []

router.post('/upload-metrics', function(req, res, next){
	metrics = req.body


	var times = metrics.currentTime.split(':')
	currTime = parseInt(times[0])*60 + parseInt(times[1])
	console.log("Current time: "+currTime+" bw: "+lastBw)

	if (timingIndex<timings.length){
		if (currTime > timings[timingIndex].time){
			setBandwidth(timings[timingIndex].bw)
			timingIndex++
		}
	}

	cmd.get(
		'ifconfig enp0s31f6 | grep "RX packets"',
		function(err, data, stderr){
			metrics.netUsage = data
			metrics.bw = lastBw
			fullList.push(metrics)
		}
	)
	res.send("Done")
});


router.post('/dump-results', function(req, res, next){
	testName = req.query.testName
	if (!testName){
		res.send("NO test name specified! FAIL!")
		return
	}
	jsonContent=JSON.stringify(fullList)

	fs.writeFile(testName+".json", jsonContent, 'utf8', function (err) {
		if (err) {
			res.send("Error! Couldn't save stuff to JSON file")
			console.log(err)
			return
		}
		res.send("Done! Saved data to the file: "+testName+".json")
	})	
})

router.post('/clear-thing', function(req, res, next){
	fullList=[]
	timingIndex=0
	if (timings.length>0 && timings[0].time==0){
		setBandwidth(timings[0].bw)
	}
	res.send("Done! cleared all the stuff!")	
})

router.get('/status', function(req, res, next){
	res.send("Currently we have: "+fullList.length+" elements")
})

module.exports = router;
