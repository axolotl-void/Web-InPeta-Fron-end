var markerData = [];

async function marker_data(pinID, api_url, iconUrl){
    var markerCheckbox = document.getElementById(pinID);
    show_loading(pinID);
    if(markerCheckbox.checked){
        await fetch(api_url)
        .then(response => response.json())
        .then(data => {
            pinIcon[pinID] = iconUrl;
            markerData[pinID] = data;
            addMarkersToMap(pinID, iconUrl);  
        });
    } else {
        delete pinIcon[pinID];
        delete markerData[pinID];
        removeMarkersFromMap(pinID);
        
    }
    hide_loading(pinID);
    legend_controller();
}
var markers = {};
const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [18, 30],
    iconAnchor: [5, 30],
    popupAnchor: [1, -34],
    shadowSize: [30, 30]
});

// function dynamic_pin_icon(dataKey){
//     let filter_by = dataKey.replace(/_pin/g, '');
//     let iconUrl = "";
//     data_koordinat.forEach(data => {
//         if(data['data'] == filter_by){
//             // console.log(data['iconUrl']);
//             iconUrl = data['iconUrl'];
//         }
//     });
//     return iconUrl;
// }
  
function addMarkersToMap(dataKey, iconUrl) {
    markers[dataKey] = L.markerClusterGroup();
        markerData[dataKey].forEach(function(markerInfo) {
            if(markerInfo.latitude != null){
                const keys = Object.keys(markerInfo);
                const nama_data = markerInfo[keys[2]];
                let alamat = "-";
                switch(true){
                    case markerInfo.alamat != undefined:
                        alamat = markerInfo.alamat;
                        break;
                    case markerInfo.alamat_lengkap != undefined:
                        alamat = markerInfo.alamat_lengkap;
                        break;
                    case markerInfo.kecamatan != undefined:
                        alamat =  "Kec. " + custom_word(markerInfo.kecamatan);
                        break;
                    default:
                        alamat = "-";
                        break;
                }
                // dynamic_pin_icon(dataKey);
                var marker = L.marker([markerInfo.latitude, markerInfo.longitude], {
                    icon: new L.Icon({
                        // iconUrl: dynamic_pin_icon(dataKey),
                        iconUrl: iconUrl,
                        shadowUrl:
                          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                        iconSize: [30, 30],
                        iconAnchor: [5, 20],
                        popupAnchor: [1, -34],
                        shadowSize: [30, 20]
                    }),
                })
                    .bindPopup("<center>" + nama_data + "<br>" + alamat + "<br><a target='_blank' class='btn btn-sm btn-info text-light' href="+ markerInfo.lokasi +">Petunjuk Arah</a></center>");
                    markers[dataKey].addLayer(marker);
            }
        });
    map.addLayer(markers[dataKey]);
    
}

// Function to remove markers from the map
function removeMarkersFromMap(dataKey) {
    if (markers[dataKey]) {
        map.removeLayer(markers[dataKey]);
    }
}
