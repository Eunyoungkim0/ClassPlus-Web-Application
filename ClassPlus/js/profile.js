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
          document.querySelector('#classList').innerHTML = "";
          document.querySelector('#semesterList').innerHTML = "2023 Fall";
          for(var i=0; i < res.data.length; i++) {
            const url = `course_detail.html?sj=${res.data[i].subject}&cn=${res.data[i].courseNumber}`;
            var elementDiv1 = document.createElement('div');
            elementDiv1.setAttribute('class', 'course');
            elementDiv1.innerHTML = "<a href='" + url + "'>" + res.data[i].subject + " " + res.data[i].courseNumber + "</a>";
            document.querySelector('#classList').appendChild(elementDiv1);
          }
      });
  }

// This function gets user data from database and show them. - Friend List
function loadFriendList(userId){
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    document.querySelector('#welcome').innerHTML = `Hello ${firstName} ${lastName}!`;

    axios.get(`/api/profile_fl/${userId}`)
        .then(res => {
        document.querySelector('#friendList').innerHTML = "";

        for(var i=0; i < res.data.length; i++){
            var elementDiv1 = document.createElement('div');
            elementDiv1.setAttribute('class', 'friend');
            
            var elementDiv2 = document.createElement('div');
            elementDiv2.setAttribute('class', 'pictureFrame');
            let picture = res.data[i].picture;
            if(picture === null){
                picture = "basicProfileImage.png";
            }
            elementDiv2.innerHTML = `<img src="../images/${picture}" class="picture">`;

            var elementDiv3 = document.createElement('div');
            elementDiv3.setAttribute('class', 'name');
            elementDiv3.innerHTML = res.data[i].firstName + " " + res.data[i].lastName;

            var elementDiv4 = document.createElement('div');
            elementDiv4.setAttribute('class', 'classlist');
            elementDiv4.setAttribute('id', `classlist${res.data[i].friendId}`);

            document.querySelector('#friendList').appendChild(elementDiv1);
            elementDiv1.appendChild(elementDiv2);
            elementDiv1.appendChild(elementDiv3);
            elementDiv1.appendChild(elementDiv4);
        }
    });
}

// This function gets overlapping classes that friends are taking.
function loadFriendClassList(userId) {
    axios.get(`/api/profile_fl_class/${userId}`)
        .then(res => {
            let friends = {};
            for(var i=0; i < res.data.length; i++){
                console.log(res.data);
                var friendId = res.data[i].friendId;
                var elementDiv = document.getElementById(`classlist${friendId}`);
                if(friends[friendId] == undefined){
                  friends[friendId] = res.data[i].subject + res.data[i].courseNumber;
                }else{
                  friends[friendId] += " | " + res.data[i].subject + res.data[i].courseNumber;
                }             
                elementDiv.innerHTML = friends[friendId];
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
        loadFriendClassList(userId);
    }else if(currentPagePath == 'profile_cp.html'){

    }
}

loadData();