async function toggle_sidebar(){
    var menu_icon = document.getElementById('menu-icon');
    //force resize 
    // const createInterval = setInterval(updateInformationPagePosition, 60);
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        menu_icon.classList.remove('fa-times');
        menu_icon.classList.add('fa-bars');
        await sleep(250);
        for (var i = 0; i < sidebar_sm.length; i++) {
            sidebar_sm[i].classList.remove("hidden");
            sidebar_lg[i].classList.add("hidden");
        }
        sidebar_close();
    } else {
        sidebar.classList.add('open');
        menu_icon.classList.remove('fa-bars');
        menu_icon.classList.add('fa-times');
        await sleep(250);
        for (var i = 0; i < sidebar_sm.length; i++) {
            sidebar_sm[i].classList.add("hidden");
            sidebar_lg[i].classList.remove("hidden");
        }
    }
    
    await sleep(250);
    updateInformationPagePosition();
    // clearInterval(createInterval);
}

function sidebar_button(id) {
    var trigering_menu = document.getElementById('menu-' + id);
    trigering_menu.classList.add('show');
    toggle_sidebar();
}

function sidebar_close(){
    // Get all elements with the class "sidebar-sm"
    var elements = document.getElementsByClassName("sidebar-sm");

    // Loop through the elements (in case there are multiple)
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        
        // Find the button element within the current "sidebar-sm" element
        var button = element.querySelector("button");
        
        // Check if a button element was found
        if (button) {
            // Get the button's id
            var buttonId = button.id;
            var trigering_menu = document.getElementById('menu-' + buttonId);
            trigering_menu.classList.remove('show');
            // console.log("Button ID:", buttonId);
        }
    }
}