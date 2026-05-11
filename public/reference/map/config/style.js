var yellowColorScale = [
    { range: [1, 5], color: '#FFFF00' },  // Kuning terang
        { range: [6, 10], color: '#FFCC00' }, // Kuning
        { range: [11, 20], color: '#FF9900' }, // Jingga
        { range: [21, 30], color: '#FF6600' }, // Oranye
        { range: [31, 40], color: '#FF3300' }, // Merah-oranye
        { range: [41, 50], color: '#FF0000' }, // Merah
];

var greenColorScale = [
    { range: [1, 5], color: '#00FF00' },  // Hijau terang
    { range: [6, 10], color: '#33FF00' }, // Hijau
    { range: [11, 20], color: '#66FF00' }, // Hijau terang
    { range: [21, 30], color: '#99FF00' }, // Hijau
    { range: [31, 40], color: '#CCFF00' }, // Hijau terang
    { range: [41, 50], color: '#FFFF00' }, // Kuning terang
];

var blueColorScale = [
    { range: [1, 5], color: '#99CCFF' },
    { range: [6, 10], color: '#6699FF' }, 
    { range: [11, 99], color: '#0066FF' },
    // { range: [1, 5], color: '#6699FF' }, // Biru terang
    // { range: [6, 10], color: '#3399FF' }, // Biru
    // { range: [11, 20], color: '#0066FF' },  // Biru terang
    // { range: [21, 30], color: '#99CCFF' }, // Biru
    // { range: [31, 40], color: '#99FFFF' }, // Biru terang
    // { range: [41, 50], color: '#CCFFFF' }, // Biru
]

var customColorScale = [
    {range: [1, 5], color: '#EF476F' },
    {range: [6, 10], color: '#FFD166' },
    {range: [11, 99], color: '#06D6A0' },
]


function choropleth_color(num=null){
    // for (var i = 0; i < blueColorScale.length; i++) {
    for (var i = 0; i < customColorScale.length; i++) {
        var range = customColorScale[i].range;
        if (num >= range[0] && num <= range[1]) {
            return customColorScale[i].color;
        }
    }
    // If the attribute value doesn't match any range, you can return a default color.
    return '#EAEAEA';
    
}

// this need configured for puskeswan only
function update_tile_choropleth(){
        if(statistic_data != null || statistic_data != ''){
            if(active_layer == "switch_kab"){
            kabupatenLayer.eachLayer(function (layer) {
                // console.log(layer.feature.properties['Kab_Kota']);
                for (var key in statistic_data) {
                    if (statistic_data.hasOwnProperty(key)) {
                        var value = statistic_data[key];
                        var count = 0;
                        value.forEach(function(item) {
                            let wilayah_selected = item['kabupaten_kota'];
                            if (layer.feature.properties['Kab_Kota'].toLowerCase() === wilayah_selected.toLowerCase()) { 
                                count++;
                            }
                        });
                        
                        layer.setStyle({
                            color: "white",
                            fillColor: choropleth_color(count),
                            fillOpacity: 0.45
                          
                        });
                    }
                }
            });
        }else if(active_layer == 'switch_kec'){
            kecamatanLayer.eachLayer(function (layer) {
                // console.log(layer.feature.properties['Kab_Kota']);
                for (var key in statistic_data) {
                    if (statistic_data.hasOwnProperty(key)) {
                        var value = statistic_data[key];
                        var count = 0;
                        value.forEach(function(item) {
                            if(item['kecamatan'] != undefined || item['kecamatan'] != null){
                                let wilayah_selected = item['kecamatan'];
                                if (layer.feature.properties['KECAMATAN'].toLowerCase() === wilayah_selected.toLowerCase()) { 
                                    count++;
                                }
                            }else{
                                count = 0;
                            }
                            
                        });
                        
                        layer.setStyle({
                            color: "white",
                            fillColor: choropleth_color(count),
                            fillOpacity: 0.45
                          
                        });
                    }
                }
            });
        }
    }
}

function resetChoropleth(){
    tileCustomStyle(kabupatenLayer);
    tileCustomStyle(kecamatanLayer);
    statistic_data = [];
    legend_controller();
}

// Custom Style each Tile 
function tileCustomStyle(fromLayer){
    fromLayer.eachLayer(function (layer) {
        var randomColor = getRandomHighSaturationHexColor(); 
        layer.setStyle({
                weight: 1.5,
                color: randomColor,
                fillColor: "#000",
                fillOpacity: 0.08
              
        });
      });
}

// Need to configure when mouse out and mouse in while on choropleth mode
// Custom Highlight Feature
function setHighlightFeature(fromLayer){
    fromLayer.eachLayer(function (layer) {
        layer.on({
            mouseover: function (e){
                var layer = e.target;
                layer.setStyle({
                    weight: 4,
                });
                
                if(!L.Browser.ie && !L.Browser.opera && !L.Browser.edge){
                    layer.bringToFront();
                }
            },
            mouseout: function (e){
                var layer = e.target;
                layer.setStyle({
                    weight: 1.5,
                });
            },
            
        });
    })
    
}