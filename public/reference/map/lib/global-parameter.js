var sidebar = document.getElementById("sidebar-menu");
var sidebar_sm = document.getElementsByClassName("sidebar-sm");
var sidebar_lg = document.getElementsByClassName("sidebar-lg");

var currentURL = window.location.href;
var lastIndex = currentURL.lastIndexOf("/"); // Find the last slash
var baseUrl = currentURL.substring(0, lastIndex); // Extract the part before the last slash
// API URL
let domain =
  window.location.hostname === "locahost"
    ? "https://inpeta.acehprov.go.id"
    : window.location.hostname;
var api_base_url = "https://" + domain + "/api/";
// var api_koordinat = "https://inpeta.acehprov.xyz/API";
var master_api = "public/geojson/master_api.json";
// var master_api = "https://inpeta.acehprov.go.id/API/";

// Temporary Save Parameter
// var datasets = [];
var pinIcon = [];
var dataset_data = [];
var master_data = [];
var statistic_data = [];
var data_koordinat = [];
var data_geospasial = [];

// Layer Parameter
let active_layer = "";
let loading_data_info = "";
let loading_arr = {};
