// Define an object to store the created layers by URL
const layerCache = {};

function createLayer(url) {
    // console.log("Url : " + url);
    // Create a new layer for the given URL
    const layer = L.geoJSON(null, {
        pane: "pane3",
        onEachFeature: function (feature, layer) {
            // initBindPopup(feature, layer);
            toolTip("geospasial", feature, layer);
        }
    });

    // Fetch data and add it to the layer
    // fetch(host + "/" + url)
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log(`Data fetched for ${url}`);
            layer.addData(data);

            // Add the layer to the map
            layer.addTo(map);

            // Store the layer in the cache
            layerCache[url] = layer;
        })
        .catch(error => {
            console.error(`Error loading GeoJSON for ${url}: `, error);
        });
}

// Function to handle checkbox changes
function handleCheckboxChange(checkbox, url) {
    if (document.getElementById(checkbox).checked) {

        // If the checkbox is checked, create the layer and add it to the map
        if (!layerCache[url]) {
            createLayer(url);
    
        } else {
            // Layer already exists in the cache, so just add it to the map
            layerCache[url].addTo(map);
    
        }
    } else {
        // console.log("checkbox not checked");
        // If the checkbox is unchecked, remove the layer from the map and cache
        if (layerCache[url]) {
            map.removeLayer(layerCache[url]);
            delete layerCache[url];
    
        }
    }
}
