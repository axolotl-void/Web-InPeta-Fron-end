async function generate_sidebar_menu(){
    var isChoropleth = [];
    var create_menu = document.getElementById('_menu');
    for(let key in master_data){
        var title = custom_word(key);
        var icon = "/" + master_data[key][0]['icon'];
        var listItem = $('<li>').addClass('border-bottom');

        var divSm = $('<div>').addClass('sidebar-sm');

        var button = $('<button>')
        .attr({
            id: key,
            class: 'nav-link py-3',
            title: title,
            'data-bs-toggle': 'tooltip',
            'data-bs-placement': 'right',
            'data-bs-original-title': title,
        });

        var img = $('<img>')
        .attr({
            src: baseUrl + icon,
            alt: 'logo',
        })
        .css({
            width: '25px',
            height: '25px',
        });

        button.append(img);
        // button.click(sidebar_button(key));
        divSm.append(button);

        var divLg = $('<div>').addClass('sidebar-lg p-2 hidden');

        var anchor = $('<a>')
        .addClass('custom-link text-light')
        .attr({
            'data-bs-toggle': 'collapse',
            href: '#menu-' + key,
            role: 'button',
            'aria-expanded': 'false',
            'aria-controls': 'menu-' + key,
        });

        var divLgTitle = $('<div>').addClass('sidebar-lg-title');

        var img2 = $('<img>')
        .attr({
            class: 'me-1',
            src: baseUrl + icon,
            alt: 'logo',
        })
        .css({
            width: '25px',
            height: '25px',
        });

        var span1 = $('<span>').text(title);

        var span2 = $('<span>')
        .css('float', 'right')
        .html('<i class="fa fa-caret-down pe-1"></i>');

        divLgTitle.append(img2, span1, span2);
        anchor.append(divLgTitle);

        var menuContent = $('<div>')
        .addClass('collapse')
        .attr('id', 'menu-' + key);

        var ulElement = $('<ul>')
        .attr('id', 'data-' + key)
        .addClass('treeview list-unstyled mt-1');

        menuContent.append(ulElement);

        divLg.append(anchor, menuContent);
        listItem.append(divSm, divLg);
        listItem.appendTo(create_menu);
        button.on('click', function() {
            sidebar_button(key);
          });

        // Generate List
        api_menu_koordinat(master_data[key][0]['data'], key, master_data[key][0]['type'], master_data[key][0]['pin'])
        master_data[key][0]['data'].forEach(item => {
            if(item.choropleth == true){
                isChoropleth.push(item);
            }
        });
    }
    var flattenedArray = [].concat.apply([], isChoropleth);
    menu_choropleth(flattenedArray)
}


function api_menu_koordinat(data, id, type, pin){
    var ul = document.getElementById('data-' + id);
    ul.innerHTML = '';
    
        data.forEach(function(item) {
            const static_id = id + "-" + item['data'];
            var div = document.createElement('div');
            var div_marker = document.createElement('div');
            var li = document.createElement('li');
            var input_checkbox_label = document.createElement('label');
            var input_checkbox = Object.assign(document.createElement('input'), {
                type: type,
                id: static_id,
                name: 'dataset',
              });
            
            if(pin == true){
                var input_marker_label = document.createElement('label');
                var input_marker = Object.assign(document.createElement('input'), {
                    type: 'checkbox',
                    id: static_id + '_pin',
                    name: 'koordinat',
                  });
                input_marker_label.setAttribute("for", static_id + '_pin');
                input_marker_label.style.marginRight = "2px";
                input_marker_label.innerHTML = '<i class="fas fa-map-marker-alt">';
                input_marker.setAttribute('onclick', "marker_data('"+ static_id + '_pin' + "', '"+ item['url']  + "', '"+ item['iconUrl'] + "')");
                div_marker.append(input_marker_label);
                div_marker.append(input_marker);
            }
           
            
            input_checkbox_label.setAttribute("for", static_id);
            input_checkbox_label.innerHTML = custom_word(item['data']);
            
            // layerHandler(checkboxId, geospasial);
            
            if(id == 'geospasial'){
                input_checkbox.setAttribute('onchange', "handleCheckboxChange('"+ static_id +"', '"+ item['url'] +"'); checkboxHandler('"+ static_id + "', '"+ item['url']  +"')");
                // console.log(static_id + " - "+ item['url']);
            }else{
                input_checkbox.setAttribute('onchange', "checkboxHandler('"+ static_id + "', '"+ item['url']  +"')");
            }

            div.classList.add('checkbox-container');
            div.append(input_checkbox);
            div.append(input_checkbox_label);
            
            
            div.append(div_marker);
            // div.append(input_marker);
            li.append(div);
            ul.appendChild(li);
        })
}

async function menu_choropleth(data){
    document.getElementById('choropleth').classList.remove('hidden');
    var ul = document.getElementById('data_statistik');
    ul.innerHTML = '';
    
        data.forEach(function(item) {
            var set_id = "statistik_" + item['data'];
            var create_div = document.createElement('div');
            var create_li = document.createElement('li');
            var create_label = document.createElement('label');
            var create_input = Object.assign(document.createElement('input'), {
                type: 'radio',
                id: set_id,
                name: 'statistik'
              });
              
            for (var key in data_statistik) {
                if(key == item['data']){
                    create_input.checked = true;
                }
            }
            
            create_input.setAttribute('onchange', "radiosStatistic('"+ item['data'] + "','" + item['url'] +"')");
            create_label.setAttribute("for", set_id);
            create_label.innerHTML = custom_word(item['data']);
            
            create_div.classList.add('checkbox-container');
            create_div.append(create_input);
            create_div.append(create_label);
            create_li.append(create_div);
            ul.appendChild(create_li);
                
        });
}
