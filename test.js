const Nick = require("nickjs")
const nick = new Nick()

const fs = require('fs')
var parse = require('csv-parse')
const STARTER_INDEX = 0;
//const BATCH_SIZE = 1000;

const shitlist = ["giftrocket", "giftly", "treatgiftcards", "giftya", "yelp", "grubhub", "postmates", "uber", "caviar", "groupon"];

fs.readFile("./restaurants.csv", function (err, fileData) {
  parse(fileData, {columns: false, trim: true}, function(err, rows) {
	// Your CSV data is in an array of arrys passed to this callback as rows.
	try{
		findAllWebsites(rows).then(websites => {
			websites.forEach(site => console.log(site));
			process.exit();
		});
	}
	catch {
		websites.forEach(site => console.log(site));
		process.exit();
	}
  })
})


let findAllWebsites = async (csvData) => {
	let websites = [];
	let tab;
	try {
		tab = await nick.newTab();
	}
	catch (err) {
		console.error(err);
	};

	console.log("Restaurant websites to be found: " + csvData.length);
	if(tab) {
		for(let i = STARTER_INDEX; i < csvData.length; i++) {
			let currRestaurantName = csvData[i][0];
			let newSite = await tabLoader(currRestaurantName, tab);
			await sleep(5000);
			if(newSite !== undefined && newSite != "#") {
				websites.push(newSite);
			}
			else {
				console.log("Died at: " + i);
				break;
			}
			if(i%25==0) {
				websites.forEach(site => console.log(site));
			}
		}
		return websites;
	}
	else {
		console.error("No tab");
		return [];
	}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let tabLoader = async (restaurantName, tab) => {
	await tab.open(`www.google.com/search?q=${restaurantName}+chicago+buy+gift+cards`)

	await tab.untilVisible("body") // Make sure we have loaded the page

	await tab.inject("http://code.jquery.com/jquery-3.2.1.min.js") // We're going to use jQuery to scrape

	let googleData;
	let goodUrl = true;

	// Unroll these loops because of super weird scoping issues

	googleData = await tab.evaluate((arg, callback) => {
		callback(null, 
			$("body").find(".r").children("a")[0].href,
		)
	});
	
	shitlist.forEach(badWebsite => {
		goodUrl &= !googleData.includes(badWebsite);
	});
	
	if(!goodUrl) {
		console.log("assholes...");
		googleData = await tab.evaluate((arg, callback) => {
			callback(null, 
				$("body").find(".r").children("a")[1].href,
			)
		});
		console.log("blah: " + googleData);
	}
	
	goodUrl = true;
	shitlist.forEach(badWebsite => {
		goodUrl &= !googleData.includes(badWebsite);
	});

	if(!goodUrl) {
		console.log("assholes...");
		googleData = await tab.evaluate((arg, callback) => {
			callback(null, 
				$("body").find(".r").children("a")[2].href,
			)
		});
		console.log("blah: " + googleData);
		goodUrl = true;
		shitlist.forEach(badWebsite => {
			goodUrl &= !googleData.includes(badWebsite);
		});
	}



	if(!goodUrl) {
		console.log("assholes...");
		googleData = await tab.evaluate((arg, callback) => {
			callback(null, 
				$("body").find(".r").children("a")[3].href,
			)
		});
		console.log("blah: " + googleData);
		goodUrl = true;
		shitlist.forEach(badWebsite => {
			goodUrl &= !googleData.includes(badWebsite);
		});
	}



	if(!goodUrl) {
		console.log("assholes...");
		googleData = await tab.evaluate((arg, callback) => {
			callback(null, 
				$("body").find(".r").children("a")[4].href,
			)
		});
		console.log("blah: " + googleData);
		goodUrl = true;
		shitlist.forEach(badWebsite => {
			goodUrl &= !googleData.includes(badWebsite);
		});
	}


	if(!goodUrl) {
		console.log("assholes...");
		googleData = await tab.evaluate((arg, callback) => {
			callback(null, 
				$("body").find(".r").children("a")[5].href,
			)
		});
		console.log("blah: " + googleData);
		goodUrl = true;
		shitlist.forEach(badWebsite => {
			goodUrl &= !googleData.includes(badWebsite);
		});
	}

	if(!goodUrl) {
		console.log("assholes...");
		googleData = await tab.evaluate((arg, callback) => {
			callback(null, 
				$("body").find(".r").children("a")[6].href,
			)
		});
		console.log("blah: " + googleData);
	}



	//googleData.name = restaurantName;

	return googleData;
};