const express = require("express");
const puppeteer = require("puppeteer");
const format_res = require("./utils/format_res");
const get_SPA = require("./utils/get_SPA");
const fetchData = require("./utils/get_store");
const fs = require("fs");

const app = express();

(async () => {
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

  app.post("/getstore", (req, res) => {
    const formattedURLs = format_res(req.body);

    Promise.all([
      ...formattedURLs.urls.map(fetchData),
      ...formattedURLs.SPA_Store_Urls.map(async (uri) => {
        return get_SPA(uri, browser);
      }),
    ])
      .then((results) => {
        res.send(JSON.stringify(results, null, 3));
        fs.writeFile(
          "serverResults.json",
          JSON.stringify(results, null, 3),
          () => {
            console.log(`scraped ${results} results >>>>>>>>`);
            console.log("yay! successfully completed");
          }
        );
      })
      .catch((e) => console.log(e.message));
  });
})();

const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {
  console.log(`server started on port ${PORT}`);
});

/** TODOS
 * 
 * EXPLORE BROWSER.CONNECT OPTIONS. (i am doubting the automatic ASYNC() function)
 * CLOSER EITHER browser.page or browser.disconnect IN get_spa FUNCTION or server.js FILE.
**/
