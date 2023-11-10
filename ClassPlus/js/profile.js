// When user clicks save button, this function executes.
// After validation check, it sends data to API.
function saveButton() {
    const formData = new FormData();
    formData.append('userId', localStorage.getItem('userId'));
    formData.append('firstName', document.getElementById('firstName').value);
    formData.append('lastName', document.getElementById('lastName').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('major', document.getElementById('major').value);
    formData.append('minor', document.getElementById('minor').value);
    formData.append('isStudent', document.getElementById('isStudent').checked);
    formData.append('isInstructor', document.getElementById('isInstructor').checked);

    const pictureFile = document.getElementById('profile-picture').files[0];

    const userId = localStorage.getItem('userId');

    if(pictureFile == ""){
        pictureFile = picture;
    }

    formData.append('profile-picture', pictureFile);

    const userAnswer = askYesNoQuestion("Do you want to save your data?");
    if (userAnswer) {
        axios.post(`/api/profile_save`, formData)
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

        let picture = res.data[0].picture;
        if (picture === null) {
            picture = "basicProfileImage.png";
        }
        const pictureElement = document.getElementById('picture');
        pictureElement.innerHTML = `<img src="../images/${picture}" class="profile-picture" style="align-item:center;">`;
        pictureElement.value = picture;

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
          var elementDiv1 = document.createElement('div');
          elementDiv1.setAttribute('class', 'course');
          elementDiv1.innerHTML = "2023 Fall";
          document.querySelector('#semesterList').appendChild(elementDiv1);

          for(var i=0; i < res.data.length; i++) {
            var elementDiv1 = document.createElement('div');
            elementDiv1.setAttribute('class', 'course');
            elementDiv1.setAttribute('onclick', `gotoCourse('${res.data[i].subject}','${res.data[i].courseNumber}')`);
            elementDiv1.innerHTML = res.data[i].subject + " " + res.data[i].courseNumber + " " + res.data[i].title;
            document.querySelector('#classList').appendChild(elementDiv1);
          }
      });
}

function gotoCourse(sj, cn) {
    const subject = sj;
    const courseNumber = cn;
    const url = `course_detail.html?sj=${subject}&cn=${courseNumber}`;
    window.location.href = url;
}

// This function gets user data from database and show them. - Friend List
function loadFriendList(userId){
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    document.querySelector('#welcome').innerHTML = `Hello ${firstName} ${lastName}!`;

    axios.get(`/api/profile_fl/${userId}`)
        .then(res => {

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

function addTime(day=0, start=0, end=0) {
    const divFrame = document.createElement('div');
    divFrame.setAttribute('class', 'available-frame');
    const selectDay = document.createElement('select');
    selectDay.setAttribute('class', 'profile-select');
    divFrame.appendChild(selectDay);
    for(var i=0; i<8; i++){
        var optionName = "optionDay" + i;
        var dynamicVariable = {};
        dynamicVariable[optionName] = document.createElement('option');
        dynamicVariable[optionName].value = i;
        var strDay = "";
        switch (i) {
            case 0:
                strDay = "Select day";
                break;
            case 1:
                strDay = "Monday";
                break;
            case 2:
                strDay = "Tuesday";
                break;
            case 3:
                strDay = "Wednesday";
                break;
            case 4:
                strDay = "Thursday";
                break;
            case 5:
                strDay = "Friday";
                break;
            case 6:
                strDay = "Saturday";
                break;
            case 7:
                strDay = "Sunday";
                break;
            default:
                strDay = "";
              
        }
        dynamicVariable[optionName].innerHTML = strDay;
        selectDay.appendChild(dynamicVariable[optionName]);
    }
    if(end > 0) selectDay.value = day;

    const inputStart = document.createElement('input');
    inputStart.setAttribute('type', 'number');
    inputStart.setAttribute('class', 'time-start');
    inputStart.setAttribute('onkeypress', 'return isNumber(event)');
    inputStart.setAttribute('min', 0);
    inputStart.setAttribute('max', 23);
    if(end > 0) inputStart.value = start;
    const span1 = document.createElement('span');
    span1.innerHTML = ":00 - ";
    const inputEnd = document.createElement('input');
    inputEnd.setAttribute('type', 'number');
    inputEnd.setAttribute('class', 'time-end');
    inputEnd.setAttribute('onkeypress', 'return isNumber(event)');
    inputEnd.setAttribute('min', 0);
    inputEnd.setAttribute('max', 23);
    if(end > 0) inputEnd.value = end;
    const span2 = document.createElement('span');
    span2.innerHTML = ":00";
    
    divFrame.appendChild(inputStart);
    divFrame.appendChild(span1);
    divFrame.appendChild(inputEnd);
    divFrame.appendChild(span2);

    const deleteTime = document.createElement('img');
    deleteTime.setAttribute('src', '../images/delete.png');
    deleteTime.setAttribute('style', 'width: 25px; height: 25px; cursor: pointer; margin-left: 20px;');
    deleteTime.setAttribute('onclick', 'deleteTime()');
    divFrame.appendChild(deleteTime);

    const divContent = document.getElementById('availableTimeList');
    divContent.appendChild(divFrame);
}

function deleteTime() {
    const images = document.querySelectorAll('.available-frame img');

    images.forEach((image, index) => {
    image.addEventListener('click', function(event) {
            const clickedImage = event.target;
            const parentDiv = clickedImage.parentElement;
            parentDiv.remove();
        });
    });
}

function dataValidate() {
    const selectInputs = document.getElementsByClassName('profile-select');
    const startInputs = document.getElementsByClassName('time-start');
    const endInputs = document.getElementsByClassName('time-end');
    for (let i = 0; i < selectInputs.length; i++) {
      const day = selectInputs[i].value;
      const start = startInputs[i].value;
      const end = endInputs[i].value;
      if(day == "" || day == 0){
        alert("Please select day");
        selectInputs[i].focus();
        return false;
      }
      if(start == ""){
        alert("Please enter available time.");
        startInputs[i].focus();
        return false;
      }
      if(start < 0 || start > 23){
        alert("Start time should be 0-23");
        startInputs[i].focus();
        return false;
      }
      if(end == ""){
        alert("Please enter available time.");
        endInputs[i].focus();
        return false;
      }
      if(end < 0 || end > 23){
        alert("End time should be 0-23");
        startInputs[i].focus();
        return false;
      }
      if(end <= start){
        alert("End time should be greater than start time.");
        endInputs[i].focus();
        return false;
      }
    }

    return true;
}


function saveTime() {
    if(dataValidate()){
        const userAnswer = askYesNoQuestion("Do you want to save your data?");
        if (userAnswer) {
            const selectInputs = document.getElementsByClassName('profile-select');
            const startInputs = document.getElementsByClassName('time-start');
            const endInputs = document.getElementsByClassName('time-end');
            const days = {};
            for (let i = 0; i < selectInputs.length; i++) {
                const day = selectInputs[i].value;
                const startValue = startInputs[i].value;
                const endValue = endInputs[i].value;

                days[day] = days[day] || [];
                const gap = endValue - startValue;
                for(let j=0; j < gap; j++){
                    const valueToAdd = parseInt(startValue) + j;
                    if (!days[day].includes(valueToAdd)) {
                        days[day].push(valueToAdd);
                    }
                }
            }

            const userId = localStorage.getItem('userId');
            const data = {
                days: days,
                userId: userId
            }
        
            axios.post(`/api/profile_at_save`, data)
                .then(res => {
                    if(res && res.data && res.data.success) {
                        console.log(res);
                        alert("Available time successfully saved!");
                        location.reload();
                    }
                });
        }
    }
}


function loadAvailableTime(userId) {
    axios.get(`/api/profile_at/${userId}`)
        .then(res => {
            if(res.data.length == 0){
                addTime();
            }else{
                var days = {};
                for(var i=0; i < res.data.length; i++){
                    const day = res.data[i].day;
                    const time = res.data[i].time;
                    days[day] = days[day] || [];
                    days[day].push(time);
                }

                const transformedData = [];

                for (const key in days) {
                    const day = key;
                    const timeSlots = days[key];
                
                    let start = null;
                    let end = null;
                
                    timeSlots.forEach(time => {
                        if (start === null) {
                            start = time;
                            end = time;
                        } else if (time === end + 1) {
                            end = time;
                        } else {
                            transformedData.push({ [day]: { start, end } });
                            start = time;
                            end = time;
                        }
                    });
                
                    transformedData.push({ [day]: { start, end } });
                }

                if(transformedData.length > 0){
                    for(var k=0; k<transformedData.length; k++){
                        const dayKey = Object.keys(transformedData[k])[0];
                        const dayData = transformedData[k][dayKey];
                        const start = dayData.start;
                        const end = parseInt(dayData.end) + 1;
                        addTime(dayKey, start, end);
                    }
                }
            }
    });
}

// This function makes sure that users put only number on unccId field.
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
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

    }else if(currentPagePath ==  'profile_at.html'){
        loadAvailableTime(userId);
    }
}

loadData();