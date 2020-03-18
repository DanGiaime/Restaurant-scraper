const Nick = require("nickjs")
const nick = new Nick()

const fs = require('fs')
var parse = require('csv-parse')
const STARTER_INDEX = 983;
const BATCH_SIZE = 49;

fs.readFile("restaurants.csv", function (err, fileData) {
  parse(fileData, {columns: false, trim: true}, function(err, rows) {
	// Your CSV data is in an array of arrys passed to this callback as rows.
	findAllWebsites(rows).then(websites => {
		websites.forEach(site => console.log(site));
		process.exit();
	});

  })
})


let findAllWebsites = async (csvData) => {
	let websites = [];
	const tab = await nick.newTab();

	console.log("Restaurant websites to be found: " + csvData.length);
	for(let i = STARTER_INDEX; i < STARTER_INDEX + BATCH_SIZE; i++) {
		let currRestaurantName = csvData[i][0];
		let newSite = await tabLoader(currRestaurantName, tab);
		if(newSite !== undefined && newSite != "#") {
			websites.push(newSite);
		}
		else {
			console.log("Died at: " + i);
			break;
		}
	}
	console.log(STARTER_INDEX + BATCH_SIZE);
	return websites;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let tabLoader = async (restaurantName, tab) => {
	await tab.open(`www.google.com/search?q=${restaurantName}+chicago`)

	await tab.untilVisible("body") // Make sure we have loaded the page

	await tab.inject("http://code.jquery.com/jquery-3.2.1.min.js") // We're going to use jQuery to scrape

	const googleData = await tab.evaluate((arg, callback) => {
		callback(null, 
			 $("body").find(".r").first().find("a").attr("href"),
		)
	})

	//googleData.name = restaurantName;

	return googleData;
};