const Nick = require("nickjs")
const nick = new Nick()

const fs = require('fs')
var parse = require('csv-parse')
const genericPool = require("generic-pool");

/**
 * Step 1 - Create pool using a factory object
 */
const factory = {
  create: function() {
    return nick.newTab();
  },
  destroy: function(tab) {
    tab.close();
  }
};

const opts = {
  max: 5, // maximum size of the pool
  min: 5 // minimum size of the pool
};

const myPool = genericPool.createPool(factory, opts);

fs.readFile("/Users/work/Downloads/POS_MS.csv", function (err, fileData) {
	parse(fileData, { columns: false, trim: true }, function (err, rows) {
		// Your CSV data is in an array of arrys passed to this callback as rows.
		let allWebsites = {};
		let allWebsitePromises = findAllWebsites(rows);
		Promise.all(allWebsitePromises).then(promises => {
			console.log("LENGTH: " + promises.length)
			promises.forEach(
				data => {
					allWebsites[data.name] = data.site
				}
			);
		})
		.then(() => console.log(allWebsites)).catch(err => console.log(err));
	})

})

let findAllWebsites = (csvData) => {
	let websites = [];
	for (let i = 0; i < csvData.length; i++) {
		let currRestaurantName = csvData[i][0];
		console.log("Checking " + currRestaurantName)
		websites.push(myPool.acquire().then(tab => findWebsiteData(currRestaurantName, tab)));
	}
	return websites;
}

// let createTabPools = async () => {
// 	let tabs = [];
// 	for (let i = 0; i < 20; i++) {
// 		tabs.push(await nick.newTab());
// 		console.log("Made tab " + i)
// 	}
// 	return tabs;
// };


let findWebsiteData = async (restaurantName, tab) => {
	// console.log(restaurantName);
	await tab.open(`www.google.com/search?q=${restaurantName}+chicago`)

	await tab.untilVisible(".r") // Make sure we have loaded the page

	await tab.inject("http://code.jquery.com/jquery-3.2.1.min.js") // We're going to use jQuery to scrape

	const googleData = await tab.evaluate((arg, callback) => {
		callback(null, {
			site: $("body").find(".r").first().find("a").attr("href"),
		})
	})

	googleData.name = restaurantName;

	myPool.release(tab);
	console.log(googleData);
	return googleData;

};