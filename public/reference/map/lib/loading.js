
function alker_loading(){
    var loading = document.getElementById('alker-loading');
    let top_bar_info = document.getElementById('top-bar-info');
    loading.style.top = (top_bar_info.offsetHeight + 10) + "px";
    loading.style.right = (legend.offsetWidth + 20) + "px";
    loading.innerHTML = "";
    for(let key in loading_arr){
        var div = $('<div>');
        // var spinnerIcon = $('<i class="spinner me-2"></i>');
        var spinnerIcon = $('<i class="fas fa-spinner fa-spin text-primary me-2"></i>');
        div.text('Memuat Data '+ custom_word(remove_dash(key)) +' ...');
        div.prepend(spinnerIcon);
        $('#alker-loading').append(div); 
    }
    var divElements = loading.querySelectorAll("div");
    var divCount = divElements.length;
    if (divCount > 0) {
        loading.classList.remove('d-none');
    }else{
        loading.classList.add('d-none');
    }
}
  
  function show_loading(title){
    loading_arr[title] = title;
    alker_loading();
  }
  
  function hide_loading(title){
    delete loading_arr[title];
    alker_loading();
  }
  
  // Get a reference to the element with the ID "aaa"
  const legend = document.getElementById("map-legend");
  
  // Create a ResizeObserver
  const resizeObserver = new ResizeObserver(() => {
    alker_loading();
  });
  
  // Start observing the element's size changes
  resizeObserver.observe(legend);
  