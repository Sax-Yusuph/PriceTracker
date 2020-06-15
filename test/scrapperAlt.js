const axios = require("axios");
const { scrapJumia, scrapKonga } = require("../scrapStore");

const userRequest = {
  item: "iphone 8",
  jumia: true,
  konga: false,
};

//   const blockedResourceTypes = [
//     'image',
//     'media',
//     'stylesheet',
//     'font',
//     'texttrack',
//     'object',
//     'beacon',
//     'csp_report',
//     'imageset',
//   ];

//   const skippedResources = [
//     'quantserve',
//     'adzerk',
//     'doubleclick',
//     'adition',
//     'exelator',
//     'sharethrough',
//     'fullstory',
//     'cdn.api.twitter',
//     'analytics.twitter.com',
//     'static.ads-twitter.com',
//     'google-analytics',
//     'googletagmanager',
//     'google',
//     'fontawesome',
//     'facebook',
//     'analytics',
//     'optimizely',
//     'clicktale',
//     'mixpanel',
//     'zedo',
//     'clicksor',
//     'tiqcdn',
//     'b9zcrrrvom',
//     '/cdnjs.cloudflare.com/ajax/libs/lazysizes/',
//     'cdn-cgi',
//     '/ajax.cloudflare.com',
//     '/chunks/styles',
//     '/chunks/vendor',
//     'commons',
//     'webpack',
//     'runtime',
//     '/_next/static/',
//     // jumia
//     'bam.nr-data.net',
//     'assets_he',
//     'fragment',
//     'js-agent'
//   ];

const scrapSite = async (userRequest) => {
  let StartTime = new Date().getTime();

  if (userRequest.jumia === true) {
    // MODIFY THE SEARCHED ITEM TO BECOME A URL LINK ********************
    let queryString = userRequest.item.replace(/\s/g, "+");

    console.log(queryString);
    let url = `https://www.jumia.com.ng/catalog/?q=${queryString}`;
    let stopTime = Math.ceil((new Date().getTime() - StartTime) / 1000);
    console.log(`scrap-url: ${url} in ${stopTime} seconds...`);
    console.log(`trying to navigate url in ${stopTime}`);

    axios(url)
      .then((response) => {
        const html = response.data;
        stopTime = Math.ceil((new Date().getTime() - StartTime) / 1000);
        console.log(`loaded jumia website in ${stopTime}`);

        // SCRAP USING CHEERIO
        scrapJumia(html);

        stopTime = Math.ceil((new Date().getTime() - StartTime) / 1000);
        console.log(`finished in ${stopTime} seconds`);
      })
      .catch(console.error);

  }

};

scrapSite(userRequest);
