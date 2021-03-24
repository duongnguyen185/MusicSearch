const express = require("express");
const app = express();
let morgan = require("morgan");
const bodyParser = require("body-parser");
let rp = require("request-promise");
let cheerio = require("cheerio");
let request = require("request");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(morgan("dev"));
app.set("view engine", "ejs");

app.use("/assets", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let urlParser = bodyParser.urlencoded({ extended: true });
app.use(cookieParser());
app.use(session({ secret: "keyboard cat", key: "sid" }));

app.use("/failed/login", (req, res, next) => {
  res.send(JSON.stringify({ statusdn: 500 }));
});

app.use("/loginsussces", (req, res) => {
  console.log(req.user.displayName);
  res.send(JSON.stringify({ statusdn: 200, username: req.user.displayName }));
});

app.use("/logout", (req, res, next) => {
  req.logout();
});

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/gioithieu", (req, res) => {
  res.send("<h1>hi<h1>");
});

app.get("/manguon", (req, res) => {
  var kw = req.query.kw;
  let page = req.query.page;

  const diachi = `http://m.nhaccuatui.com/tim-kiem/bai-hat?q=${kw}&page=${page}&b=title&sort=0`;
  request(diachi, (error, response, body) => {
    const options = {
      uri: diachi,
      transform: function (body) {
        return cheerio.load(body);
      },
    };
    (async function crawler() {
      try {
        var $ = await rp(options);
      } catch (error) {
        return error;
      }

      let data = [];
      let count = $(".count_resuilt .count").text();
      // console.log(" count"+count);
      data.push({ count: count });
      let dataSong = [];
      let songItem = $(".song_item_single");
      for (let i = 0; i < songItem.length - 1; i++) {
        let baihat = $(songItem[i]);
        let tenBaiHat = baihat.find(".box_info h3 a").text().trim();
        let tenCaSi = baihat.find(".box_info h4 a").text().trim();
        let linkHinh = baihat.find(".item_thumb a img").attr("data-src");

        let encryptKey = baihat.find(".ic_play_circle").attr("keyencrypt");
        let keyyotu = baihat.find(".item_thumb a").attr("refkeyyoutube");

        dataSong.push({
          tenBaiHat,
          tenCaSi,
          linkHinh,
          encryptKey,
          keyyotu,
        });
      }
      data.push({ datasong: dataSong });
      console.log(data);
      res.send(JSON.stringify(data));
    })();
  });
});

app.get("/hostkey", (req, res) => {
  var kw = req.query.kw;

  const diachi = `http://m.nhaccuatui.com/`;
  request(diachi, (error, response, body) => {
    const options1 = {
      uri: diachi,
      transform: function (body) {
        return cheerio.load(body);
      },
    };
    (async function crawler() {
      try {
        var $ = await rp(options1);
      } catch (error) {
        return error;
      }
      let hostkey = $(".ulHotKey .resuilt a").text().trim();
      for (let i = 0; i < hostkey.length; i++) {
        console.log(hostkey[i]);
      }
    })();
  });
});

app.post("/login", urlParser, (req, res) => {
  let user = req.body.user;
  let pws = req.body.pws;
  console.log(user, pws);
  if (user == "admin" && pws == "admin") {
    res.send(JSON.stringify({ statusdn: 200 }));
  } else {
    res.send(JSON.stringify({ statusdn: 500 }));
  }
});
const server = app.listen(7000, () => {
  console.log("Chay thanh cong port 7000");
});
