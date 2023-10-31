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
    document.querySelector('#loginout').innerHTML = "Log"
    if(!userId || userId === undefined){
        document.querySelector('#loginout').innerHTML += "in";
        linkElement.href = 'login.html';
        localStorage.setItem('didLogin', 'n');
    }else{
        document.querySelector('#loginout').innerHTML += " out";
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

// When the page loads, this function executes.
function onLoad() {
    const userId = localStorage.getItem('userId');
    needsLogin(userId);
    setLoginButton(userId);
}

onLoad();
