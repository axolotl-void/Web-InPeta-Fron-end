window.addEventListener('resize', who_browser);
const loadingText = document.getElementById('loading-info');
async function preloaderState(){
    // document.getElementById('preloader').style.display = "none";
    who_browser();
    loadingText.textContent = "Loading Map ...";
    await Promise.all([createKabLayer(), createKecLayer()])
    .catch((error) => {
      console.error("Error creating GeoJSON layers: ", error);
    });
    
    // Api Data
    loadingText.textContent = "Loading Api Data ...";
    await Promise.all([
        await api_query(master_api).then(data => {
           master_data = data[0];
        }),
        
    ]).catch((error) => {
        console.error("Error Load Api Data: ", error);
    });
    // Creating Menu
    loadingText.textContent = "Preparing Menu ...";
    await Promise.all([
        await generate_sidebar_menu(),
        await legend_controller()
    ]).catch((error) => {
        console.log("Error Creating Menu: ", error);
    });
    loadingText.textContent = "Menghitung Data ...";
    // await sleep(5000)
    await info_box_count();
    // processItems(master_data['koordinat'][0]['data'])
    // .then(() => {
    //   // This code will run after all items are processed
    //   console.log('All items processed.');
    // })
    // .catch((error) => {
    //   console.error('An error occurred:', error);
    // });
    // Default Checked
    await toggle_geojson_label('f-kab');
    await layerHandler("switch_kab", kabupatenLayer);
    // Open Page
    loadingText.textContent = "Opening Page ...";
    await sleep(1000);
    document.getElementById('preloader').style.display = "none";

}

async function info_box_count(){
    master_data['koordinat'][0]['data'].forEach(item => {
         switch(true){
            case item['data'] == 'puskeswan':
                document.getElementById('info-box-puskeswan').innerHTML = '<i class="fas fa-spinner fa-spin text-primary ml-2"></i>';;
                api_query(item['url']).then((data) => {
                    document.getElementById('info-box-puskeswan').textContent = data.length;
                    });
                break;
            case item['data'] == 'penerima_sertifikat_nkv':
                document.getElementById('info-box-penerima-sertifikat').innerHTML = '<i class="fas fa-spinner fa-spin text-primary ml-2"></i>';;
                api_query(item['url']).then((data) => {
                    document.getElementById('info-box-penerima-sertifikat').textContent = data.length;
                    });
                break;
            case item['data'] == 'peternak':
                document.getElementById('info-box-peternak').innerHTML = '<i class="fas fa-spinner fa-spin text-primary ml-2"></i>';;
                api_query(item['url']).then((data) => {
                    document.getElementById('info-box-peternak').textContent = data.length;
                    });
                break;
            case item['data'] == 'rph':
                document.getElementById('info-box-rph').innerHTML = '<i class="fas fa-spinner fa-spin text-primary ml-2"></i>';;
                api_query(item['url']).then((data) => {
                    document.getElementById('info-box-rph').textContent = data.length;
                    });
                break;
        }
        
    });
}

async function processItems(arr) {
    for (const item of arr) {
      switch (true) {
        case item['data'] == 'puskeswan':
            document.getElementById('info-box-puskeswan').innerHTML = '<i class="fas fa-spinner fa-spin text-primary ml-2"></i>';
            await api_query(item['url']).then((data) => {
                document.getElementById('info-box-puskeswan').textContent = data.length;
                console.log(data.length);
                loadingText.textContent = "Menghitung Data " + custom_word(item['data']) + " ...";
                });
            break;
        case item['data'] == 'penerima_sertifikat_nkv':
            await api_query(item['url']).then((data) => {
                document.getElementById('info-box-penerima-sertifikat').textContent = data.length;
                loadingText.textContent = "Menghitung Data " + custom_word(item['data']) + " ...";
                });
            break;
        case item['data'] == 'peternak':
            await api_query(item['url']).then((data) => {
                document.getElementById('info-box-peternak').textContent = data.length;
                loadingText.textContent = "Menghitung Data " + custom_word(item['data']) + " ...";
                });
            break;
        case item['data'] == 'rph':
            await api_query(item['url']).then((data) => {
                document.getElementById('info-box-rph').textContent = data.length;
                loadingText.textContent = "Menghitung Data " + custom_word(item['data']) + " ...";
                });
            break;
      }
    }
  }
  
  