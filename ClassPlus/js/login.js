// This function is for input validation.
// It checks userEmail, userPassword
function dataValidation() {
    if(document.getElementById('userEmail').value == ""){
        alert("Please enter your UNCC email address");
        document.getElementById('userEmail').focus();
        return false;
    }else if(!document.getElementById('userEmail').value.includes("@uncc.edu")){
        alert("Please use your UNCC email address.");
        document.getElementById('userEmail').focus();
        return false;
    }

    if(document.getElementById('userPassword').value == ""){
        alert("Please enter your password");
        document.getElementById('userPassword').focus();
        return false;
    }

    return true;
}

// This function doesn't allow users to type space bar
function inputConstraint(){
    // User can't type space bar in the password
    document.getElementById('userPassword').addEventListener('keydown', function(event) {
        if (event.key === ' ') {
            event.preventDefault();
        }
    });
    // User can't type space bar in the email
    document.getElementById('userEmail').addEventListener('keydown', function(event) {
        if (event.key === ' ') {
            event.preventDefault();
        }
    });
}

// When user clicks login button, this function executes.
// After validation check, it sends data to API.
function login() {
    if(dataValidation()){
        const data = {
            userEmail: document.getElementById('userEmail').value,
            userPassword: document.getElementById('userPassword').value
        };
        
        axios.post(`/api/login`, data)
            .then(res => {
                console.log(res);
                if(res && res.data && res.data.success) {
                    localStorage.setItem('userId', res.data.userId);
                    location.replace('index.html');
                }else if(!res.data.success) {
                    alert(res.data.myContent);
                }
            });
    }
}

// When the page loads, this function executes.
function onLoad() {
    const userId = localStorage.getItem('userId');
    needsLogin(userId);
    setLoginButton(userId);

    inputConstraint();

}

onLoad();
