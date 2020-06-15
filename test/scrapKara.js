const axios = require("axios");
const { scrapKara } = require("../scrapStore");

const userRequest = {
  item: "infinix note 7",
  jumia: false,
  konga: false,
  Ebay: false,
  Slot: true
};

const scrapSite = async (userRequest) => {
  let StartTime = new Date().getTime();

  if (userRequest.Slot === true) {
    // MODIFY THE SEARCHED ITEM TO BECOME A URL LINK ********************
    let queryString = userRequest.item.replace(/\s/g, "+");

    console.log(queryString);
    let url = `https://www.kara.com.ng/catalogsearch/result/?q=${queryString}`;
    let stopTime = Math.ceil((new Date().getTime() - StartTime) / 1000);
    console.log(`scrap-url: ${url} in ${stopTime} seconds...`);
    console.log(`trying to navigate url in ${stopTime}`);

    axios(url)
      .then((response) => {
        const html = response.data;
        stopTime = Math.ceil((new Date().getTime() - StartTime) / 1000);
        console.log(`loaded kara website in ${stopTime}`);

        // SCRAP USING CHEERIO
        scrapKara(html);

        stopTime = Math.ceil((new Date().getTime() - StartTime) / 1000);
        console.log(`finished in ${stopTime} seconds`);
      })
      .catch(console.error);

  }

};

scrapSite(userRequest);
