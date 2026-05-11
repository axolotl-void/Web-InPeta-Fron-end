
var lkp4 = L.geoJSON(null, {
    pane: "pane3",
    onEachFeature: function (feature, layer) {
        // initBindPopup(feature, layer);
        toolTip("lp4", feature, layer);
    }
});


function lp4(){
    // console.log('on create');
    return new Promise((resolve) => {
        // Fetch the GeoJSON Data for Kecamatan
        fetch(host + "/public/maps/geojson/lp_master.geojson")
        .then(response => response.json())
        .then(data => {
        lkp4.addData(data);
        resolve(lkp4, data);
        })
        .catch(function(error) {
        console.error('Error loading GeoJSON Code4: ', error);
        });
       
    });
}
