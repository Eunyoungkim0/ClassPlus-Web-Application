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
    if(!userId || userId === undefined){
        document.querySelector('#loginout').innerHTML = "Login";
        linkElement.href = 'login.html';
    }else{
        document.querySelector('#loginout').innerHTML = "Log out";
        linkElement.href = '#';
        linkElement.onclick = function() {
            localStorage.removeItem('userId');
            location.replace('index.html');
        };
    }
}

// It asks Yes/No question and returns user's response.
function askYesNoQuestion(question) {
    const userResponse = window.confirm(question);
    return userResponse;
}
