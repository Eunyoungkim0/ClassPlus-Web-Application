// This function changes sub-nav background color and text color depending on the page.
function setNavColor(){
    var vPillsTab = document.getElementById('v-pills-tab');
    var navItem = vPillsTab.getElementsByClassName('nav-item');
    var navLink = vPillsTab.getElementsByClassName('nav-link');

    for (var i = 0; i < navItem.length; i++) {
        navItem[i].style.backgroundColor = 'white';
    }
    for (var i = 0; i < navLink.length; i++) {
        navLink[i].style.color = '#004F34';
    }

    const currentPagePath = window.location.pathname.substring(1);
    var profileLink = document.getElementById(currentPagePath);
    var aElement = profileLink.querySelector('a');
    profileLink.style.backgroundColor = '#004F34';
    aElement.style.color = 'white';
}

setNavColor();