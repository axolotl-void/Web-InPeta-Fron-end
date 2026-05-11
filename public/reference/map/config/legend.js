function legend_config(){
    let top_bar_info = document.getElementById('top-bar-info');
    document.getElementById('map-legend').style.top = (top_bar_info.offsetHeight + 10) + "px";
}

function legend_marker(){
    let ul = $('#legend-marker-data');
    ul.empty();
    for(let key in pinIcon){
        let li = $('<li>');
        let div_parent = $('<div class="legend-list">');
        let icon = $('<img class="legend-icon" src="'+ pinIcon[key] +'">');
        let div_child = $('<div>');
        
        div_child.html(custom_word(remove_dash(key.replace(/_pin/g, ""))));
        div_parent.append(icon, div_child);
        li.append(div_parent);
        ul.append(li);
    };
}

function legend_choropleth(){
    let ul = $('#legend-choropleth-data');
    ul.empty();
    customColorScale.forEach((item, index) => {
        let li = $('<li>');
        let div_parent = $('<div class="legend-list">');
        let icon = $('<div class="legend-icon" style="background-color:'+ item['color'] +'">');
        let div_child = $('<div>');

        // Determine the label based on the range values
        let label = '';
        if (index === customColorScale.length - 1) {
            label = '> ' + item['range'][0];
        } else {
            label = item['range'][0] + ' > ' + item['range'][1];
        }
        div_child.html("Nilai ( " + label + " )");
    
        div_parent.append(icon, div_child);
        li.append(div_parent);
        ul.append(li);
    });
    
}

function legend_controller(){
    legend_config();
    if(Object.keys(markerData).length > 0 || Object.keys(statistic_data).length > 0){
        $('#map-legend').slideDown(500);
        if(Object.keys(markerData).length > 0){
            $('#legend-marker').slideDown(700);
            legend_marker();
        }else{
            $('#legend-marker').slideUp(400);
        }
        if(Object.keys(statistic_data).length > 0){
            $('#legend-choropleth').slideDown(700);
            legend_choropleth();
        }else{
            $('#legend-choropleth').slideUp(400);
        }
    }else{
        $('#map-legend').slideUp(500);
    }
}
