// When user clicks save button, this function executes.
// After validation check, it sends data to API.
function saveButton() {
    const data = {
        userId : localStorage.getItem('userId'),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        major: document.getElementById('major').value,
        minor: document.getElementById('minor').value,
        isStudent: document.getElementById('isStudent').checked,
        isInstructor: document.getElementById('isInstructor').checked,
    };

    const userAnswer = askYesNoQuestion("Do you want to save your data?");
    if (userAnswer) {
        axios.post(`/api/profile_save`, data)
            .then(res => {
                if(res && res.data && res.data.success) {
                    console.log(res);
                    alert("Data successfully saved!");
                }
            });
    }
}

// This function gets user data from database and show them. - Information
function loadUserInfo(userId) {
    axios.get(`/api/profile/${userId}`)
        .then(res => {
        console.log(res.data);

        document.querySelector('#firstName').value = res.data[0].firstName;
        document.querySelector('#lastName').value = res.data[0].lastName;
        document.querySelector('#email').value = res.data[0].email;
        document.querySelector('#major').value = res.data[0].major;
        document.querySelector('#minor').value = res.data[0].minor;

        if(res.data[0].isStudent == 1){
            document.querySelector('#isStudent').checked = true;
        }
        if(res.data[0].isInstructor == 1){
            document.querySelector('#isInstructor').checked = true;
        }
        if(res.data[0].isTa == 1){
            document.querySelector('#isTa').checked = true;
        }
    }) 
}

// This function gets user data from database and show them. - Class Information
function loadUserClassList(userId){
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    document.querySelector('#welcome').innerHTML = `Hello ${firstName} ${lastName}!`;

      axios.get(`/api/profile_ci/${userId}`)
        .then(res => {
          //console.log(res.data);

          document.querySelector('#classList').innerHTML = "";
          document.querySelector('#semesterList').innerHTML = "2023 Fall";
          for(var i=0; i < res.data.length; i++){
            //console.log(res.data[i]);
            document.querySelector('#classList').innerHTML += res.data[i].subject + " " + res.data[i].courseNumber + "<br>";
          }
          //document.querySelector('#classList').value = res.data[0].lastName;

      });
  }

// This function gets user data from database and show them. - Friend List
function loadFriendList(userId){
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    document.querySelector('#welcome').innerHTML = `Hello ${firstName} ${lastName}!`;

    axios.get(`/api/profile_fl/${userId}`)
        .then(res => {
        //console.log(res.data);

        let friends = {};
        for(var i=0; i < res.data.length; i++){
            var friendName = res.data[i].firstName + " " + res.data[i].lastName;
            if(friends[friendName] == undefined){
            friends[friendName] = res.data[i].subject + " " + res.data[i].courseNumber;
            }else{
            friends[friendName] += " and more"
            }                  
        }

        document.querySelector('#friendList').innerHTML = "";
        for (let key in friends) {
            //console.log(key + ": " + friends[key]);
            if(friends[key] == 'null null'){
            document.querySelector('#friendList').innerHTML += key + "<br><br>";
            }else{
            document.querySelector('#friendList').innerHTML += key + " (" + friends[key] + ")<br><br>";
            }
        }
    });
}

// This function loads data depending on its page name.
function loadData(){
    const currentPagePath = window.location.pathname.substring(1);
    const userId = localStorage.getItem('userId');

    if(currentPagePath == 'profile.html'){
        loadUserInfo(userId);
    }else if(currentPagePath == 'profile_ci.html'){
        loadUserClassList(userId);
    }else if(currentPagePath == 'profile_fl.html'){
        loadFriendList(userId);
    }else if(currentPagePath == 'profile_cp.html'){

    }
}

loadData();
