/*
 * layer.js
 * Author: Alker
*/

var host = window.location.origin.indexOf("localhost") !== -1 ? "/inPETA" : "";

// map.createPane("pane250").style.zIndex = 250; // between tiles and overlays
// map.createPane("pane450").style.zIndex = 450; // between overlays and shadows
// map.createPane("pane620").style.zIndex = 620; // between markers and tooltips
// map.createPane("pane800").style.zIndex = 800; // above popups
map.createPane("pane1").style.zIndex = 251; // between tiles and overlays
map.createPane("pane2").style.zIndex = 252; // between tiles and overlays
map.createPane("pane3").style.zIndex = 253; // between tiles and overlays

// Create the GeoJSON layers for Kabupaten
var kabupatenLayer = L.geoJSON(null, {
    pane: "pane1",
    onEachFeature: function (feature, layer) {
        // initBindPopup(feature, layer);
        toolTip("kabupaten", feature, layer);
    }
});
  
// Create the GeoJSON layers for Kecamatan
var kecamatanLayer = L.geoJSON(null, {
    pane: "pane2",
    onEachFeature: function (feature, layer) {
        // initBindPopup(feature, layer);
        toolTip("kecamatan", feature, layer);
    }
});


function createKabLayer(){
    return new Promise((resolve) => {
        // Fetch the GeoJSON Data for Kabupaten
        fetch(host + "/public/maps/geojson/kabupaten.geojson")
        .then(response => response.json())
        .then(data => {
          kabupatenLayer.addData(data);
          // Add Custom Color each Tile
          tileCustomStyle(kabupatenLayer);
          // Add Custom Higlight
          setHighlightFeature(kabupatenLayer);
          // checkboxStates();
          resolve(kabupatenLayer, data);
          
      })
      // .then(hidePreloader())
      .catch(function(error) {
          console.error('Error loading GeoJSON Code1: ', error);
      });
      
    });
}

function createKecLayer(){
    return new Promise((resolve) => {
        // Fetch the GeoJSON Data for Kecamatan
        fetch(host + "/public/maps/geojson/kecamatan.geojson")
        .then(response => response.json())
        .then(data => {
        kecamatanLayer.addData(data);
        // Add Custom Color each Tile
        tileCustomStyle(kecamatanLayer);
        // Add Custom Higlight
        setHighlightFeature(kecamatanLayer);
        resolve(kecamatanLayer, data);
        })
        .catch(function(error) {
        console.error('Error loading GeoJSON Code2: ', error);
        });
       
    });
}


function layerHandler(id, layer){
    // isChecked Logic
    if(document.getElementById(id).checked == true){
        active_layer = id;
        layer.addTo(map);
        // layerZindex(id, layer);
        if(document.getElementById('nama_kabupaten').checked == true){
            toggle_geojson_label('f-kab', 'show');
        }else {
            toggle_geojson_label('f-kab', 'hide');
        }
        if(document.getElementById('nama_kecamatan').checked == true){
            toggle_geojson_label('f-kec', 'show');
        }else{
            toggle_geojson_label('f-kec', 'hide');
        }
    }else{
        layer.removeFrom(map);

    }
}

function load_and_check_layer(){
    layerHandler('switch_kab', kabupatenLayer);
    layerHandler('switch_kec', kecamatanLayer);
    markerData.forEach(item => {
        // console.log(item);
    });
}

function switchLayer() {
    // First, remove the current layer from the map
    var radios = document.getElementsByName('switch_layer');

    // Loop through the radio buttons to find the selected one
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            var selectedLayer = radios[i].value;

            // Remove all existing layers from the map
            map.eachLayer(function (layer) {
                map.removeLayer(layer);
            });

            // Add the selected layer to the map
            switch (selectedLayer) {
                case 'googleStreets':
                    googleStreets.addTo(map);
                    break;
                case 'googleSat':
                    googleSat.addTo(map);
                    break;
                case 'googleHybrid':
                    googleHybrid.addTo(map);
                    break;
                case 'googleTerrain':
                    googleTerrain.addTo(map);
                    break;
                default:
                    googleStreets.addTo(map); // Fallback if none selected
                    break;
            }

            break; // Break out of the loop since we found the selected radio button
        }
    }
    load_and_check_layer();
    for (var key in markerData) {
        addMarkersToMap(key);
    }

}

function toolTip(geo, feature, layer){
    // let hoverTimeout;
    
    //Direct Temp
    if(geo == "geospasial"){
        // console.log("on tooltip")
            layer.on('mouseover', function(e){
                // console.log("on mouse hover");
                // var jenis_hpt = e.target.feature.properties['jenis_hpt'];
                // var nama_pemilik_lahan = e.target.feature.properties['nama_pemilik_lahan'];
                // e.target.bindTooltip(jenis_hpt + "<br>" + nama_pemilik_lahan).openTooltip();
                var kab = feature.properties.hasOwnProperty("kabupaten_kota") ? feature.properties['kabupaten_kota'] : feature.properties['Kabupaten']
                e.target.bindTooltip(kab).openTooltip();
            });
        layer.on('click', function(e) {
            // console.log(e.target.feature.properties['kabupaten_kota']);
            // information_page_data(feature.properties['kabupaten_kota'], 'kab');
            if(feature.properties.hasOwnProperty("kabupaten_kota")){
                information_page_data(feature.properties['kabupaten_kota'], 'kab');
                // console.log("Has Properties Kab_kota")
            }else{
                information_page_data(feature.properties['Kabupaten'], 'kab');
                // console.log("Not Have Properties Kab_kota")
            }
            
        });
    }

     

    if(geo == "kabupaten"){
        // Jika ada waktu: fitur hover nama kecamatan dan nama kabupaten
        // if(document.getElementById('nama_kabupaten').checked != true){
        //     layer.on('mouseover', function(e){
        //             var hover_name = e.target.feature.properties['Kab_Kota'];
        //             e.target.bindTooltip(hover_name).openTooltip();
        //         });
        // }
        layer.on('click', function(e) {
            // var clickedLayer = e.target;
            // map.fitBounds(clickedLayer.getBounds());
            information_page_data(feature.properties['Kab_Kota'], 'kab');
            
        });
        // // Tambahkan event hover
        // layer.on('mouseover', function (e) {
        //     layer_hover_info(layer, feature, geo);
        //     hoverTimeout = setTimeout(() => {
        //         this.openPopup();
        //     }, 700); 
        // });
        
        // layer.on('mouseout', function (e) {
        //     clearTimeout(hoverTimeout);
        //     this.closePopup();
        // });

        layer.bindTooltip(feature.properties['Kab_Kota'],{
            permanent: true,
            direction: "center",
            className: "f-kab no-background hidden",
        });
    }
    if(geo == 'kecamatan'){
        layer.on('click', function() {
            information_page_data(feature.properties['KECAMATAN'], 'kec');
        });
                
        // // Tambahkan event hover
        // layer.on('mouseover', function (e) {
        //     layer_hover_info(layer, feature, geo);
        //     hoverTimeout = setTimeout(() => {
        //         this.openPopup();
        //     }, 700); 
        // });

        // layer.on('mouseout', function (e) {
        //     clearTimeout(hoverTimeout);
        //     this.closePopup();
        // });

        layer.bindTooltip(feature.properties['KECAMATAN'],{
            permanent: true,
            direction: "center",
            className: "f-kec no-background hidden"
        });
    }
}

function toggle_geojson_label(l_name, act=null){
    const elements = document.getElementsByClassName(l_name);

    for (let i = 0; i < elements.length; i++) {
        if(act == 'show'){
            elements[i].classList.remove('hidden');
        }else if(act == 'hide'){
            elements[i].classList.add('hidden');
        }else{
            elements[i].classList.toggle('hidden');
        }
    }
   
}