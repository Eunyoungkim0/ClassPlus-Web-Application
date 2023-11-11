// If the page needs login, it checks login information.
// If login information does not exist, it directs to login.html page.
function needsLogin(userId) {
    const currentPagePath = window.location.pathname.substring(1);
    axios.get(`/api/checkLogin/${currentPagePath}`)
            .then(res => {
                if(res && res.data && res.data.success) {
                    if(res.data.needsLogin == 1 && (!userId || userId === undefined)){
                        location.replace('login.html');
                    }
                }
            });
}

// If login information exists, it shows log out button.
// If login information does not exist, it show log in button.
function setLoginButton(userId) {
    const linkElement = document.getElementById('linkforloginout');
    linkElement.innerHTML = "Log"
    if(!userId || userId === undefined){
        linkElement.innerHTML += "in";
        linkElement.href = 'login.html';
        localStorage.setItem('didLogin', 'n');
    }else{
        linkElement.innerHTML += " out";
        localStorage.setItem('didLogin', 'y');
        linkElement.href = '#';
        linkElement.onclick = function() {
            localStorage.removeItem('userId');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            location.replace('index.html');
            localStorage.setItem('didLogin', 'n');
        };
    }
}

// It asks Yes/No question and returns user's response.
function askYesNoQuestion(question) {
    const userResponse = window.confirm(question);
    return userResponse;
}

// For nav, this function checks if login information exists.
// If login information does not exist, it direct to login page before going to the page.
function loginCheckBeforeNav(page){
    const didLogin = localStorage.getItem('didLogin');
    if (didLogin == 'y'){
        location.replace(page);
    }else{
        localStorage.setItem('destination', page);
        location.replace('login.html');
    }
}

// This function is for formatting date
function formatDateString(dateString) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/New_York'
    };
  
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options).replace(/,/g, '');
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

// When the page loads, this function executes.
function onLoad() {
    const userId = localStorage.getItem('userId');
    needsLogin(userId);
    setLoginButton(userId);
}

onLoad();