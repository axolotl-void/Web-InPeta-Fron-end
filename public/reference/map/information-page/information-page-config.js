var map_size = document.getElementById('alker-map');
var information_page = document.getElementById('information-page');
var informationPageContent = document.getElementById("information-page-content");

function updateInformationPagePosition() {
    // information_page.style.height = map_size.offsetHeight + 'px';
    informationPageContent.style.height = map_size.offsetHeight + 'px';
    information_page.style.width = map_size.offsetWidth + 'px';
    // console.log('in interval');
    if (information_page.classList.contains('open')) {
        information_page.style.bottom = 0;
        // information_page.style.right = 0;
    } else {
        information_page.style.bottom = "-" + (informationPageContent.offsetHeight) + "px";
    }
}

updateInformationPagePosition();
window.addEventListener('resize', updateInformationPagePosition);

function information_page_toggle(){
    information_page.classList.toggle('open');
    if(information_page.classList.contains('open')){
        // document.getElementById('information-button').style.bottom = 0;
        document.getElementById('information-button').style.display = "none";
        // document.getElementById('information-page-icon').classList.remove('fa-arrows-up-to-line');
        // document.getElementById('information-page-icon').classList.add('fa-arrows-down-to-line');
    }else{
        // document.getElementById('information-button').style.bottom = 0;
        document.getElementById('information-button').style.display = "block";
        // document.getElementById('information-page-icon').classList.remove('fa-arrows-down-to-line');
        // document.getElementById('information-page-icon').classList.add('fa-arrows-up-to-line');
    }
    updateInformationPagePosition();
}