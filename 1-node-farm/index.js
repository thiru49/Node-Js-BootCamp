const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./module/replaceTemplate");
//Sync way accesing file data
/* const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);
console.log("hello welcome");

const textOut = `This write to file on ${textIn}.this creaeted ny thiruppathi ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut); */

/* fs.readFile(`./txt/start.txt`, "utf-8", (err, data1) => {
  if (err) return console.log("Error reading start.txt:", err);
  console.log(data1);

  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    if (err) return console.log(`Error reading ${data1}.txt:`, err);
    console.log(data2);

    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      if (err) return console.log("Error reading append.txt:", err);
      console.log(data3);

      fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
        if (err) return console.log("Error writing to final.txt:", err);
        console.log("Your file has been written");
      });
    });
  });
});
console.log("the file was written!..."); */
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const parseData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  console.log();
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const cardsHtml = parseData
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    console.log(query);
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const product = parseData[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });
    res.end("404 - Not Found");
  }
});

server.listen("8000", "127.0.0.1", () => {
  console.log("server is running");
});
