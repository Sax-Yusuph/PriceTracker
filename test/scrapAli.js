const fs = require("fs");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { scrapAli } = require("../scrapStore");

const userRequest = {
  item: "iphone 6s",
  jumia: false,
  konga: false,
  Ebay: false,
  Slot: false,
  Ali: true,
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
  "tmall",
  "retcode",
  "mpulse.net",
  "alilog",
  "assets.alicdn.com/g/ae-fe/g-loader/index.js",
  "us.cobra.aliexpress.com/p4pforlist.html",
  "ttps://login.aliexpress.ru/setCommonCookie.htm",
  "https://is.alicdn.com/js/6v/biz/common/store-proxy/store-proxy2.html",
  "https://i.alicdn.com/g/sc-assets/flasher-config/prefetch/5abx3t8moki/a3jyjrsiwd6.js",
  "https://s.alicdn.com/@g/flasher-manifest/aliexpress/manifest.json",
  "https://lighthouse.aliexpress.com/buyer/StoreNewArrivalsProductNumAjax.htm",
  "https://acs.aliexpress.com/h5/mtop.aliexpress.lighthouse.config.get/1.0/",
  "https://lighthouse.aliexpress.com/shopcart/buyer_pay_low_notice_ajax.htm",
  "https://message.aliexpress.com/message/messageUnreadCountAjaxService.htm",
  "header-ui",
  "vendors.js",
  // "home.js",
  "standalone",
];

const scrapSite = async (userRequest) => {

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
      console.log(requestUrl);
      request.continue();
    }
  });

  let queryString = userRequest.item.replace(/\s/g, "+");
  let url = `https://www.aliexpress.com/wholesale?SearchText=${queryString}`;
  console.log(url);
  try {
    // NAVIGATE TO THE PAGE VIA PUPPETEEER
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    const data = await page.evaluate(() => {
      const products = window.runParams.items;
      const ScrapedData = products.map((product) => {
        return {
          productName: product.title,
          productLink: `https:${product.productDetailUrl.split("?")[0]}`,
          newPrice: product.price,
          pickUp: product.logisticsDesc,
          productAvailability: product.tradeDesc,
          productImage: `https:${product.imageUrl}`,
        };
      });
      return ScrapedData
    });

    console.log(`${data.length} results`);
    console.log(`.....................................................................\n........................................................`);
    // console.log(data);

    fs.writeFile("AliData.json",JSON.stringify(data, null, 3), (err) => {
      if (err) throw err;
      console.log("done successfully");
    });
  } catch (error) {
    console.log(error.message);
  }

  await browser.close();
};

scrapSite(userRequest);
