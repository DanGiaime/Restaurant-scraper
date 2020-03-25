// First time
// For use on rallyforrestaurants.com

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let cards = $('.rally-for-restaurants-card');
let topCards = cards.find('.rally-for-restaurants-card__content');
let links = cards.find('.rally-for-restaurants-card__cta-container');

let currName;
let currAddress;
let currLink;
let infoArr = [];
let totalString = "";

for (let i = 0; i < 10; i++) {
    currName = topCards[i].children[0].innerText.replace(/,/g, "");
    currAddress = topCards[i].children[1].innerText.replace(/,/g, "");
    currLink = (links[i].children.length == 0 ? [{href: ""}] : links[i].children)[0].href.replace(/,/g, "");
    console.log(`${currName}, ${currAddress}, ${currLink}`);
    totalString += `${currName}, ${currAddress}, ${currLink}`.replace(/\n/g, " ") + "\n";
    infoArr.push(
        {
            name: currName,
            address: currAddress,
            gcLink: currLink
        }
    );
}

console.log(infoArr);
console.log(totalString);

// Second time +
const NUM_PAGES = 71;
for(let i = 0; i < NUM_PAGES; i++) {
    $('.next-page-button')[1].click();
    await sleep(3000);
    cards = $('.rally-for-restaurants-card');
    topCards = cards.find('.rally-for-restaurants-card__content');
    links = cards.find('.rally-for-restaurants-card__cta-container');

    for (let i = 0; i < 10; i++) {
        currName = topCards[i].children[0].innerText.replace(/,/g, "");
        currAddress = topCards[i].children[1].innerText.replace(/,/g, "");
        currLink = (links[i].children.length == 0 ? [{href: ""}] : links[i].children)[0].href.replace(/,/g, "");
        console.log(`${currName}, ${currAddress}, ${currLink}`);
        totalString += `${currName}, ${currAddress}, ${currLink}`.replace(/\n/g, " ") + "\n";
        infoArr.push(
            {
                name: currName,
                address: currAddress,
                gcLink: currLink
            }
        );
    }

    console.log(infoArr);
    console.log(totalString);
}