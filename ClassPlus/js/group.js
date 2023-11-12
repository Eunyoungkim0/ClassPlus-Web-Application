let data;
let groupId;

//---------------------------------------------------------------------------------
// START OF FUNCTIONS FOR MY GROUP
function getMyGroup(){
    const userId = localStorage.getItem('userId');
    axios.get(`/api/getMyGroup/${userId}`)
    .then(res => {
        if(res.data.length == 0){
            var divCourse = document.createElement('div');
            divCourse.innerHTML = "You are not part of any groups.";
            document.querySelector('.box').appendChild(divCourse);
        }else{
            for(var i=0; i < res.data.length; i++){
                var groupId = res.data[i].groupId;
                var groupName = res.data[i].groupName;
                var description = res.data[i].description;
                var courseId = res.data[i].courseId;
                var subject = res.data[i].subject;
                var courseNumber = res.data[i].courseNumber; 
                var title = res.data[i].title;
                var members = res.data[i].members;
    
                var divCourse = document.createElement('div');
                var divGroupName = document.createElement('div');
                var divGroupDsc = document.createElement('div');
                var divGroupMembers = document.createElement('div');
                var divGroupLine = document.createElement('div');
                var divGroupCourse = document.createElement('div');
    
                divCourse.setAttribute('class', 'group-frame');
                divCourse.setAttribute('onclick', `gotoGroup('${groupId}')`);
                divGroupName.setAttribute('class', 'group-name');
                divGroupDsc.setAttribute('class', 'group-def');
                divGroupMembers.setAttribute('class', 'group-members');
                divGroupLine.setAttribute('class', 'group-line');
                divGroupCourse.setAttribute('class', 'group-course');
    
                divGroupName.innerHTML = groupName;
                divGroupDsc.innerHTML = description;
                divGroupCourse.innerHTML = subject + courseNumber + " " + title;
                divGroupMembers.innerHTML = members + " people are in this group.";
    
                document.querySelector('.box').appendChild(divCourse);
                divCourse.appendChild(divGroupName);
                divCourse.appendChild(divGroupDsc);
                divCourse.appendChild(divGroupMembers);
                divCourse.appendChild(divGroupLine);
                divCourse.appendChild(divGroupCourse);
            }
        }
    });
}

function gotoGroup(gi) {
    const groupId = gi;
    const url = `group_detail.html?gi=${groupId}`;
    window.location.href = url;
}

// This function sets course subject.
function getSubject(){
    axios.get(`/api/getCourseSubject`)
    .then(res => {
        for(var i=0; i < res.data.length; i++){
            var option = document.createElement('option');
            option.setAttribute('value', res.data[i].subject);
            option.innerHTML = res.data[i].subject;
            document.querySelector('#subjectSelect').appendChild(option);
        }
    });   
}
// END OF FUNCTIONS FOR MY GROUP
//---------------------------------------------------------------------------------

function navigateToJoin() {
    axios.post(`/api/joinGroup`, data)
    .then(res => {
        if(res && res.data && res.data.success) {
            const message = "Successfully joined";
            alert(message);
            location.reload();
        }else if(res && res.data && res.data.alreadyJoined) {
            const message = "You're already joined in this group.";
            alert(message);
        }
    });   
}

// This function loads group information
function groupInfo(data) {    
    axios.post(`/api/getGroupInfo`, data)
    .then(res => {
        if(res && res.data) {
            var courseInfo = res.data[0].subject + res.data[0].courseNumber + " " + res.data[0].title;
            document.getElementById('groupname').innerHTML = res.data[0].groupName;
            document.getElementById('coursename').innerHTML = " - " + courseInfo;
            document.getElementById('groupInformation').setAttribute('onclick', `gotoGroup('${groupId}')`);
        }
    });            
}

function amIJoined(data) {
    axios.post(`/api/getGroupPermission`, data)
        .then(res => {
            const btnJoin = document.getElementById('buttonForJoin');

            if(res && res.data && res.data.enrolled && res.data.joined) {
                if(btnJoin != null) btnJoin.hidden = true;
            }else if(res && res.data && !res.data.enrolled){
                if(btnJoin != null) btnJoin.hidden = true;
            }else if(res && res.data && res.data.enrolled && !res.data.joined){
                if(btnJoin != null) btnJoin.hidden = false;
            }
      });
}


function loadGroupInfo() {
    // Get the query string from the URL
    const currentPagePath = window.location.pathname.substring(1);
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    const userId = localStorage.getItem('userId');
    groupId = urlParams.get('gi');

    axios.post(`/api/getGroup/${groupId}?userId=${userId}`)
    .then(res => {
        if(res && res.data) {
            console.log(res.data);
            console.log(res.data);
            const amIJoined = res.data[0].amIJoined;
            const amIEnrolled = res.data[0].amIEnrolled;
            document.getElementById('groupName').innerHTML = res.data[0].groupName;
            document.getElementById('groupDescription').innerHTML = ": " + res.data[0].description;
            document.getElementById('memberCount').innerHTML = res.data[0].members;

            axios.get(`/api/getGroupMembers/${groupId}?userId=${userId}`)
            .then(res => {
                if(res && res.data) {
                    console.log(res.data);
                    var divMembers = document.getElementById('memberList');
                    for(var i=0; i < res.data.length; i++){
                        const isFriend = res.data[i].isFriend;
                        const friendId = res.data[i].userId;

                        const divFrame = document.createElement('div');
                        divFrame.setAttribute('class', 'member-frame');
                        const divPicture = document.createElement('div');
                        divPicture.setAttribute('class', 'picture-frame');
                        const imgPicture = document.createElement('img');
                        let picture = res.data[i].picture;
                        if(picture === null){
                            picture = "basicProfileImage.png";
                        }
                        imgPicture.setAttribute('src', `../images/${picture}`);
                        imgPicture.setAttribute('class', 'picture');
                        const divMemberName = document.createElement('div');
                        divMemberName.setAttribute('class', 'member-name');
                        divMemberName.innerHTML = res.data[i].firstName + " " + res.data[i].lastName;

                        divMembers.appendChild(divFrame);
                        divFrame.appendChild(divPicture);
                        divPicture.appendChild(imgPicture);
                        divFrame.appendChild(divMemberName);
                        
                        if(amIJoined == 1 && friendId != userId && isFriend == 0){
                            const btnFollow = document.createElement('button');
                            btnFollow.setAttribute('class', 'follow-button');
                            btnFollow.setAttribute('onclick', `followFriend(${userId}, ${friendId})`);
                            const divFollow = document.createElement('div');
                            divFollow.setAttribute('class', 'course-text');
                            divFollow.innerHTML = "Follow";
                            btnFollow.appendChild(divFollow);
                            divFrame.appendChild(btnFollow);
                        }
                    }
                }
            });
        }
    });
}

function loadGroupMeeting(groupId) {
    axios.get(`/api/getGroupAvailableTime/${groupId}`)
    .then(res => {
        console.log(res.data);
        const divTimeList = document.getElementById('timeList');
        if(res.data.length == 0){
            divTimeList.innerHTML = "There are no available time.";
        }else{
            for(var i=0; i < res.data.length; i++){
                addTime(res.data[i].day, res.data[i].time, res.data[i].count);
            }
        }
    });   
}

function addTime(day=0, time=0, count=0){
    const divTimeList = document.getElementById('timeList');

    const divFrame = document.createElement('div');
    divFrame.setAttribute('class', 'available-frame');

    const labelRadio = document.createElement('label');
    labelRadio.setAttribute('class', 'radio-container');
    const radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'time');
    radio.setAttribute('class', 'meeting-radio');
    const spanRadio = document.createElement('span');
    spanRadio.setAttribute('class', 'checkmark');

    labelRadio.appendChild(radio);
    labelRadio.appendChild(spanRadio);

    const selectDay = document.createElement('select');
    selectDay.setAttribute('class', 'meeting-select');
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
    if(day > 0) {
        selectDay.value = day;
        selectDay.disabled = true;
    }

    const inputStart = document.createElement('input');
    inputStart.setAttribute('type', 'number');
    inputStart.setAttribute('class', 'time-start');
    inputStart.setAttribute('onkeypress', 'return isNumber(event)');
    inputStart.setAttribute('min', 0);
    inputStart.setAttribute('max', 23);
    if(day > 0) {
        inputStart.value = time;
        inputStart.disabled = true;
    }
    const span1 = document.createElement('span');
    span1.innerHTML = ":00 - ";
    const inputEnd = document.createElement('input');
    inputEnd.setAttribute('type', 'number');
    inputEnd.setAttribute('class', 'time-end');
    inputEnd.setAttribute('onkeypress', 'return isNumber(event)');
    inputEnd.setAttribute('min', 0);
    inputEnd.setAttribute('max', 23);
    if(day > 0) {
        inputEnd.value = time + 1;
        inputEnd.disabled = true;
    }
    const span2 = document.createElement('span');
    span2.innerHTML = ":00";

    
    divTimeList.appendChild(divFrame);
    divFrame.appendChild(labelRadio);
    divFrame.appendChild(selectDay);

    divFrame.appendChild(inputStart);
    divFrame.appendChild(span1);
    divFrame.appendChild(inputEnd);
    divFrame.appendChild(span2);

    
    if(day > 0){
        const spanCount = document.createElement('span');
        spanCount.setAttribute('class', 'available-people');
        spanCount.innerHTML = count + " people are available at this time."
        divFrame.appendChild(spanCount);
    }else if(day == 0){
        const deleteTime = document.createElement('img');
        deleteTime.setAttribute('src', '../images/delete.png');
        deleteTime.setAttribute('style', 'width: 25px; height: 25px; cursor: pointer; margin-left: 20px;');
        deleteTime.setAttribute('onclick', 'deleteTime()');
        divFrame.appendChild(deleteTime);
    }
}

function pickTime() {
    var buttons = document.querySelectorAll('.pick-button');

    buttons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            var selectDay = this.parentElement.querySelector('.meeting-select');
            var day = selectDay.value;
            var timeStart = this.parentElement.querySelector('.time-start');
            var start = timeStart.value;
            var timeEnd = this.parentElement.querySelector('.time-end');
            var end = timeEnd.value;

            if(day == 0){
                alert("Please select day");
                selectDay.focus();
                return false;
            }
            if(start == ""){
                alert("Please enter available time.");
                timeStart.focus();
                return false;
            }
            if(start < 0 || start > 23){
                alert("Start time should be 0-23");
                timeStart.focus();
                return false;
            }
            if(end == ""){
                alert("Please enter available time.");
                timeEnd.focus();
                return false;
            }
            if(end < 0 || end > 23){
                alert("End time should be 0-23");
                timeEnd.focus();
                return false;
            }
            if(end <= start){
                alert("End time should be greater than start time.");
                timeEnd.focus();
                return false;
            }


        });
    });
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

function addLocation() {
    const divLocationList = document.getElementById('locationList');

    const divFrame = document.createElement('div');
    divFrame.setAttribute('class', 'available-frame');

    const labelRadio = document.createElement('label');
    labelRadio.setAttribute('class', 'radio-container');
    const radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'location');
    radio.setAttribute('class', 'meeting-radio');
    const spanRadio = document.createElement('span');
    spanRadio.setAttribute('class', 'checkmark');

    labelRadio.appendChild(radio);
    labelRadio.appendChild(spanRadio);


    const inputLocation = document.createElement('input');
    inputLocation.setAttribute('type', 'text');
    inputLocation.setAttribute('class', 'location');
    
    
    divLocationList.appendChild(divFrame);
    divFrame.appendChild(labelRadio);
    divFrame.appendChild(inputLocation);

    
    const deleteTime = document.createElement('img');
    deleteTime.setAttribute('src', '../images/delete.png');
    deleteTime.setAttribute('style', 'width: 25px; height: 25px; cursor: pointer; margin-left: 20px;');
    deleteTime.setAttribute('onclick', 'deleteTime()');
    divFrame.appendChild(deleteTime);
}

// This function executes in the course homepage.
function loadGroupHomepage(currentPagePath){
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    groupId = urlParams.get('gi');

    if(groupId == ""){
        alert("The wrong approach.");
        location.replace("mygroup.html");
    }

    data = {
        userId : localStorage.getItem('userId'),
        groupId : groupId,
    };

    groupInfo(data);
    amIJoined(data);

    if(currentPagePath == 'group_detail.html'){
        loadGroupInfo();
    }else if(currentPagePath == 'group_meeting.html'){
        loadGroupMeeting(groupId);
    }
}

// This function loads data depending on its page name.
function loadData(){
    const currentPagePath = window.location.pathname.substring(1);

    if(currentPagePath == 'mygroup.html'){
        getMyGroup();
    }else if(currentPagePath == 'group_search.html'){
        getSubject();
    }else{
        loadGroupHomepage(currentPagePath);
    }
}

loadData();
