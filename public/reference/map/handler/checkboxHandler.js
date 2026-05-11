async function checkboxHandler(checkboxId, url){
    var checkbox = document.getElementById(checkboxId);
    show_loading(checkboxId);
    if(checkbox.checked){
        try {
            await fetch(url)
            .then(response => response.json())
            .then(data => {
            
                if(checkboxId.includes('geospasial-')){
                    var ldata = data.features;
                    var tdata = [];
                    ldata.forEach(item => {
                        tdata.push(item.properties);
                    });
                    dataset_data[checkboxId] = tdata;
                    
                }else{
                    dataset_data[checkboxId] = data;
                }
                information_page_has_data();
            });
        } catch (error) {
            hide_loading(checkboxId);
        }
        
    } else {
        delete dataset_data[checkboxId];
        information_page_has_data();
    }
    hide_loading(checkboxId);
}

async function radiosStatistic(radioId, url){
    statistic_data = [];
    try {
       show_loading(radioId) // Show the loading spinner
    
        const response = await fetch(url);
        const data = await response.json();
    
        hide_loading(radioId);
        statistic_data[radioId] = data;
        update_tile_choropleth();
        legend_controller();
        // Use 'data' to update your content or do other processing
      } catch (error) {
        console.error('Error fetching data:', error);
        hide_loading(radioId);
      }
    
}


