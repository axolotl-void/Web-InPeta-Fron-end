/*
 * alker-lib.js
 * Author: Alker
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function who_browser() {
  /* Storing user's device details in a variable*/
  let details = navigator.userAgent;

  /* Creating a regular expression 
  containing some mobile devices keywords 
  to search it in details string*/
  let regexp = /android|iphone|kindle|ipad/i;

  /* Using test() method to search regexp in details
  it returns boolean value*/
  let isMobileDevice = regexp.test(details);

  if (isMobileDevice) {
    // console.log("You are using a Mobile Device");
    return window.location.replace("mobile_device");
  } else {
    // console.log("You are using Desktop");
  }
}

async function api_query(query) {
  try {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Request Error: ", error);
    throw error;
  }
}

function custom_word(data) {
  // Menggantikan underscore ( _ ) ke spasi
  var after = data.replace(/_/g, " ");
  return capitalizeEveryWord(after);
}

function remove_dash(str) {
  // let str = "data-off-bean";
  let parts = str.split("-"); // Split the string at each dash

  if (parts.length > 1) {
    // If there's at least one dash in the string
    parts.shift(); // Remove the first element (the part before the first dash)
    let result = parts.join("-"); // Join the remaining parts with dashes
    return result;
    // console.log(result); // Output: "off-bean"
  } else {
    // If there are no dashes in the string, simply keep the original string
    return str;
  }
}

function capitalizeEveryWord(str) {
  // Pisahkan teks menjadi array kata-kata
  const words = str.split(" ");

  // Loop melalui setiap kata dan ubah huruf pertama menjadi kapital
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  });

  // Gabungkan kembali array kata-kata yang telah diubah menjadi satu string
  const capitalizedString = capitalizedWords.join(" ");

  return capitalizedString;
}

function switch_condition(data) {
  let cnd;
  switch (true) {
    case data == null || data == "":
      cnd = "-";
      break;
    case data.toString().includes("http"):
      cnd = document.createElement("a");
      cnd.href = data;
      cnd.target = "_blank";
      cnd.classList.add("btn", "btn-success", "btn-sm");
      cnd.textContent = "Kunjungi"; // Set the link text
      break;
    default:
      cnd = data;
  }
  return cnd;
}

function getRandomHexColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomBrightHexColor() {
  var color = "#";

  // Atur nilai komponen merah, hijau, dan biru ke angka yang tinggi
  var red = Math.floor(Math.random() * 256); // Nilai merah antara 0 dan 255
  var green = Math.floor(Math.random() * 256); // Nilai hijau antara 0 dan 255
  var blue = Math.floor(Math.random() * 256); // Nilai biru antara 0 dan 255

  // Konversi nilai merah, hijau, dan biru ke format hex
  var redHex = red.toString(16).padStart(2, "0");
  var greenHex = green.toString(16).padStart(2, "0");
  var blueHex = blue.toString(16).padStart(2, "0");

  // Gabungkan nilai-nilai hex untuk membentuk warna
  color += redHex + greenHex + blueHex;

  return color;
}

function getRandomHighSaturationHexColor() {
  var color = "#";

  // Atur nilai hue (warna) secara acak antara 0 dan 360 (seluruh spektrum warna)
  var hue = Math.floor(Math.random() * 361); // Nilai antara 0 dan 360
  var saturation = 90 + Math.floor(Math.random() * 11); // Nilai antara 90 dan 100 (saturasi tinggi)
  var lightness = 50; // Tetapkan tingkat kecerahan pada 50 (nilai tengah)

  // Konversi nilai HSL ke format hex
  color += hslToHex(hue, saturation, lightness);

  return color;
}

// Fungsi untuk mengonversi HSL ke format hex
function hslToHex(h, s, l) {
  h /= 360; // Konversi nilai hue ke rentang 0-1
  s /= 100; // Konversi nilai saturasi ke rentang 0-1
  l /= 100; // Konversi nilai lightness ke rentang 0-1

  var r, g, b;
  if (s === 0) {
    r = g = b = l; // Jika saturasi adalah 0, hasilnya adalah gray
  } else {
    var hueToRgb = function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function toggle_hidden_class(identification_class_name) {
  const elements = document.getElementsByClassName(identification_class_name);

  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.toggle("hidden");
  }
}

function remove_last_underscore(str) {
  var lastUnderscoreIndex = str.lastIndexOf("_");

  if (lastUnderscoreIndex !== -1) {
    // If there is at least one underscore in the string
    var result = str.substring(0, lastUnderscoreIndex);
  }
  return result;
}
