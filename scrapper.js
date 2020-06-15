const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");
const { performance } = require('perf_hooks');
// const cheerio = require('cheerio')
const {
  scrapJumia,
  scrapKonga,
  scrapAli,
  scrapKara,
  scrapSlot,
  scrapEbay,
} = require("./scrapStore");

const userRequest = {
  item: "infinix hot 8",
  urls: ["Konga", "Jumia", "AliExpress", "Kara", "Ebay", "Slot"],
};

const blockedResourceTypes = [
  "image",
  "media",
  "stylesheet",
  "font",
  "texttrack",
  "object",
  "beacon",
  "csp_report",
  "imageset",
];

const skippedResources = [
  "quantserve",
  "adzerk",
  "doubleclick",
  "adition",
  "exelator",
  "sharethrough",
  "fullstory",
  "cdn.api.twitter",
  "analytics.twitter.com",
  "static.ads-twitter.com",
  "google-analytics",
  "googletagmanager",
  "google",
  "fontawesome",
  "facebook",
  "analytics",
  "optimizely",
  "clicktale",
  "mixpanel",
  "zedo",
  "clicksor",
  "tiqcdn",
  "b9zcrrrvom",
  "/cdnjs.cloudflare.com/ajax/libs/lazysizes/",
  "cdn-cgi",
  "/ajax.cloudflare.com",
  "/chunks/styles",
  "/chunks/vendor",
  "commons",
  "webpack",
  "runtime",
  "/_next/static/",
  // jumia
  "bam.nr-data.net",
  "assets_he",
  "fragment",
  "js-agent",
];

let queryString = userRequest.item.replace(/\s/g, "+");
const urls = userRequest.urls
  .filter((url) => url !== "Konga" && url !== "AliExpress")
  .map((url) => {
    let storeUrl = "";
    switch (url) {
      case "Jumia":
        storeUrl = `https://www.jumia.com.ng/catalog/?q=${queryString}`;
        break;
      case "Kara":
        storeUrl = `https://www.kara.com.ng/catalogsearch/result/?q=${queryString}`;
        break;
      case "Slot":
        storeUrl = `https://slot.ng/?s=${queryString}&post_type=product`;
        break;
      case "Ebay":
        storeUrl = `https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=${queryString}&_sacat=0`;
        break;
    }

    return storeUrl;
  });
  
  SPAStoreUrls = userRequest.urls
  .filter((url) => url !== "Jumia" && url !==  "Kara" && url !== "Ebay" && url !==  "Slot")
  .map((url) => {
    let SPAStoreUrl = "";
    switch (url) {
      case "AliExpress":
        queryString = userRequest.item.replace(/\s/g, "+");
        SPAStoreUrl = `https://www.aliexpress.com/wholesale?SearchText=${queryString}`;
        break;
      case "Konga":
        queryString = userRequest.item.replace(/\s/g, "%20");
        SPAStoreUrl = `https://www.konga.com/search?search=${queryString}`;
        break;
      }
      return SPAStoreUrl;
    });
    






function fetchData(URL) {
  return axios
    .get(URL)
    .then(function (response) {
      let data = {};

      switch (URL.split(".")[1]) {
        case "jumia":
          data = { jumia: scrapJumia(response.data) };
          break;
        case "ebay":
          data = { ebay: scrapEbay(response.data) };
          break;
        case "slot":
          data = { slot: scrapSlot(response.data) };
          break;
        case "kara":
          data = { kara: scrapKara(response.data) };
          break;
      }

      return data;
    })
    .catch(function (error) {
      return { success: false };
    });
}

getSPAStores = async (SPAStoreUrls) => {
  console.log(`SPAStoreUrls : ${SPAStoreUrls}`)
  const t0 = performance.now()
  console.log(`${t0 / 1000} milliseconds`)
  const browser = await puppeteer.launch({
    args: [
      // "--proxy-server=" + proxy,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  // await page.setUserAgent(userAgent);

  // PAGE SETTINGS ***************************************
  page.on("request", (request) => {
    const requestUrl = request._url.split("?")[0].split("#")[0];
    if (
      blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
      skippedResources.some((resource) => requestUrl.indexOf(resource) !== -1)
    ) {
      request.abort();
    } else {
      console.log(requestUrl)
      request.continue();
    }
  });

  for (let url of SPAStoreUrls) {
    console.log(url.split(".")[1]);

    if (url.split(".")[1] === "aliexpress") return;

    try {
      // NAVIGATE TO THE PAGE VIA PUPPETEEER
      await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
      let html = await page.content();
      let data = {};
      console.log(`${(performance.now() - t0)/1000} milliseconds`)

      switch (url.split(".")[1]) {
        case "konga":
          data = { konga: scrapKonga(html) };
          break;
      }
      // console.log(data);
      console.log(`${(performance.now() - t0) / 1000} milliseconds`)
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }

  await browser.close();
};



function getAllData(URLs, SPAUrls) {
  return Promise.all([...URLs.map(fetchData),getSPAStores(SPAUrls)]);
}


// EXECUTE CODE FUNCTION HERE!!!*************************************************
getAllData(urls, SPAStoreUrls)
  .then((resp) => {
    fs.writeFile("storeResults.json", JSON.stringify(resp), () => {
      console.log("yay! successfully completed")
    });
    // console.log(JSON.stringify(resp, null, 2));
  })
  .catch((e) => {
    console.log(e);
  });
