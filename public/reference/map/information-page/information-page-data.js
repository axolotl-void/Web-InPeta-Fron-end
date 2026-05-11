function information_page_has_data() {
  var idl = document.getElementById("information-page-title");
  if (idl.textContent != "Silahkan Pilih Kabupaten/Kecamatan di Peta") {
    information_page_data(
      idl.textContent,
      active_layer.substring(7),
      "dont open"
    );
  }
}

function information_page_data(title = null, wilayah = null, trigger = null) {
  // var sidebarElement = document.querySelector(".sidebar");
  if (!information_page.classList.contains("open") && trigger == null) {
    information_page_toggle();
  }

  var exc = ["id", "OBJECTID_1", "fid"];

  $("#information-page-title").text(title);
  $("#information-page-api-data").empty();

  // Display Data
  var wilayah_selected = "wilayah";
  // var propertiesString = '';

  if (dataset_data != null || dataset_data != "") {
    var navRole = $('<div class="nav nav-tabs" id="nav-tab" role="tablist">');
    var tabContent = $(
      '<div class="tab-content bg-white ps-2 pe-2 pb-4" id="nav-tabContent">'
    );

    // var thead = createTable.append($('<thead>').append(tr));
    $("#information-page-api-data").append(
      $("<nav>").append(navRole),
      tabContent
    );
    for (var key in dataset_data) {
      if (dataset_data.hasOwnProperty(key)) {
        var createTable = $(
          '<table class="table table-bordered table-striped font-size-small">'
        );
        var thead = $('<thead class="text-center align-middle">');
        var headerRow = $("<tr>");
        var tbody = $('<tbody class="text-center align-middle">');

        var notFound = $('<div name="content_data">').html("Data Belum Ada.");
        var jumlah_data = $('<span id="count_' + key.replace(/ /g, "-") + '">');
        var count = 0;
        var table_field = [];

        dataset_data[key].forEach(function (item) {
          if (wilayah == "kab") {
            // if(!item.hasOwnProperty('kabupaten_kota')){
            //     item['kabupaten_kota'] = item['Kabupaten'];
            // }
            wilayah_selected = item.hasOwnProperty("kabupaten_kota")
              ? item["kabupaten_kota"]
              : item["Kabupaten"];
            // console.log(wilayah_selected);
          } else {
            wilayah_selected = item["kecamatan"];
          }
          if (wilayah_selected == undefined) {
            wilayah_selected = "not set";
          }
          // console.log(wilayah_selected);
          if (title.toLowerCase() === wilayah_selected.toLowerCase()) {
            var row = $("<tr>");
            count++;
            row.append($("<td>").html(count + "."));
            for (var key in item) {
              // key.includes("_id")
              let containsExc = exc.some((element) => key.includes(element));
              if (!containsExc) {
                if (!table_field.includes(key)) {
                  table_field.push(key);
                }
                // switch_condition(item[key]);
                row.append($("<td>").html(switch_condition(item[key])));
              }
              // if(key != 'id'){
              //     if (!table_field.includes(key)) {
              //         table_field.push(key);
              //     }
              //     // switch_condition(item[key]);
              //     row.append($('<td>').html(switch_condition(item[key])));
              // }
            }
            tbody.append(row);
          }
        });

        // Create a new div for the title
        var titleDiv = $('<div name="content_data">').addClass(
          "fw-bold pt-2 pb-2 font-size-small"
        );
        if (count > 0) {
          jumlah_data.text(count.toString());
          titleDiv.text("Jumlah: ").append(jumlah_data);
          headerRow.append($("<th>" + "No." + "</th>"));
          table_field.forEach((item) => {
            headerRow.append($("<th>" + custom_word(item) + "</th>"));
          });
          table_field = [];
          // createTable.append(thead.append(tr));
        } else {
          titleDiv.append(notFound);
        }
        //Nav Tab Element
        var navBtn = $(
          '<button class="nav-link alker-nav" id="nav-' +
            key.replace(/ /g, "-") +
            '-tab" data-bs-toggle="tab" data-bs-target="#nav-' +
            key.replace(/ /g, "-") +
            '" type="button" role="tab" aria-controls="nav-' +
            key.replace(/ /g, "-") +
            '" aria-selected="false">' +
            custom_word(remove_dash(key)) +
            "</button>"
        );
        var tabPane = $(
          '<div class="tab-pane alker-tab fade" id="nav-' +
            key.replace(/ /g, "-") +
            '" role="tabpanel" aria-labelledby="nav-' +
            key.replace(/ /g, "-") +
            '-tab">'
        );
        tabContent.append(
          tabPane.append(
            titleDiv,
            createTable.append(thead.append(headerRow), tbody)
          )
        );
        //   tabContent.append(tabPane.append(createTable.append(thead.append(tr))));
      }
      navRole.append(navBtn);
    }
  }
  $(".alker-nav:last").addClass("active");
  $(".alker-tab:last").addClass("show active");

  var content_data = document.querySelector('[name="content_data"]');

  if (!content_data) {
    $("#information-page-api-data").append(
      $('<div class="text-danger">').text("Belum ada data yang dipilih! \n"),
      $("<span>").text("Silahkan pilih menu untuk menampilkan data.")
    );
  }
}
