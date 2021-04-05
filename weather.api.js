var express = require("express");
var router = express.Router();
const request = require("superagent");
const BASE = "https://www.metaweather.com/api";

router.get("/getCities", function (req, res, next) {
  const { query } = req;
  const { city } = query;
  const url = `${BASE}/location/search/`;
  request
    .get(`${url}?query=${city}`)
    .then((response) => res.json(JSON.parse(response.text)))
    .catch((err) => console.log(err));
});

router.get("/getLocationWeather", function (req, res, next) {
  const { query } = req;
  const { woeid } = query;
  const url = `${BASE}/location/${woeid}`;
  request
    .get(url)
    .then((response) => res.json(JSON.parse(response.text)))
    .catch((err) => console.log(err));
});

module.exports = router;
