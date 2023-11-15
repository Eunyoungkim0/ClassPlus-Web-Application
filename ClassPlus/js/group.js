let data;
let groupId;
let enrolled;
let joined;

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

// This function sets course number according to the subject that a user selects.
function handleSelectChange(selectElement) {
    const selectedValue = selectElement.value;
    const classes = document.getElementById('classSelect');
    for (let i = classes.options.length - 1; i >= 0; i--) {
        classes.remove(i);
    }

    axios.get(`/api/getClasses/${selectedValue}`)
    .then(res => {
        for(var i=0; i < res.data.length; i++){
            var option = document.createElement('option');
            option.setAttribute('value', res.data[i].courseNumber);
            option.innerHTML = res.data[i].courseNumber + " " + res.data[i].title;
            document.querySelector('#classSelect').appendChild(option);
        }
    });
}

function searchGroups() {

    subject = document.getElementById('subjectSelect').value;
    courseNumber = document.getElementById('classSelect').value;
    groupName = document.getElementById('groupName').value;

    data = {
        userId : localStorage.getItem('userId'),
        subject : subject,
        courseNumber: courseNumber,
        groupName : groupName,
        limit : 0,
    };

    axios.post(`/api/getSearchedGroups`, data)
    .then(res => {
        if(res && res.data) {
            if(res.data.length == 0){
                document.getElementById('divForGroup').innerHTML = "There is no group with this information.";
            }else{
                for (var i = 0; i < res.data.length; i++) {
                    // Check if it's the start of a new row
                    if (i % 3 === 0) {
                        // Create a new row div
                        var rowElement = document.createElement('div');
                        rowElement.setAttribute('class', 'row');
                        document.getElementById('divForGroup').appendChild(rowElement);
                    }
                
                    // Create a div for each group
                    var divElement1 = document.createElement('div');
                    divElement1.setAttribute('class', 'group-frame');
                    divElement1.style.maxWidth = '400px';
                    divElement1.setAttribute('onclick', `gotoGroup('${res.data[i].groupId}')`);
                
                    var divElement2 = document.createElement('div');
                    divElement2.setAttribute('class', 'group-title');
                    divElement2.innerHTML = res.data[i].groupName;
                
                    var divElement3 = document.createElement('div');
                    divElement3.setAttribute('class', 'group-description');
                    divElement3.innerHTML = res.data[i].description;
                
                    var divElement4 = document.createElement('div');
                    divElement4.setAttribute('class', 'group-course');
                    divElement4.innerHTML = res.data[i].subject + res.data[i].courseNumber + " : " + res.data[i].title;
                
                    var divElement5 = document.createElement('div');
                    divElement5.setAttribute('class', 'group-member');
                    divElement5.innerHTML = res.data[i].member + " people are in this group.";
                
                    // Append divs to the current row
                    rowElement.appendChild(divElement1);
                    divElement1.appendChild(divElement2);
                    divElement1.appendChild(divElement3);
                    divElement1.appendChild(divElement4);
                    divElement1.appendChild(divElement5);
                }
                
            }
        }
    });   
}

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
            const btnSave = document.getElementById('saveMeeting');
            const btnAddTime = document.getElementById('addTime');
            const btnAddLocation = document.getElementById('addLocation');
            enrolled = res.data.enrolled;
            joined = res.data.joined;

            if(res && res.data && res.data.enrolled && res.data.joined) {
                if(btnJoin != null) btnJoin.hidden = true;
                if(btnSave != null) btnSave.hidden = false;
                if(btnAddTime != null) btnAddTime.hidden = false;
                if(btnAddLocation != null) btnAddLocation.hidden = false;
            }else if(res && res.data && !res.data.enrolled){
                if(btnJoin != null) btnJoin.hidden = true;
                if(btnSave != null) btnSave.hidden = false;
                if(btnAddTime != null) btnAddTime.hidden = false;
                if(btnAddLocation != null) btnAddLocation.hidden = false;
            }else if(res && res.data && res.data.enrolled && !res.data.joined){
                if(btnJoin != null) btnJoin.hidden = false;
                if(btnSave != null) btnSave.hidden = true;
                if(btnAddTime != null) btnAddTime.hidden = true;
                if(btnAddLocation != null) btnAddLocation.hidden = true;
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
            const amIJoined = res.data[0].amIJoined;
            const amIEnrolled = res.data[0].amIEnrolled;
            document.getElementById('groupName').innerHTML = res.data[0].groupName;
            document.getElementById('groupDescription').innerHTML = ": " + res.data[0].description;
            document.getElementById('memberCount').innerHTML = " "+ res.data[0].members;

            axios.get(`/api/getGroupMembers/${groupId}?userId=${userId}`)
            .then(res => {
                if(res && res.data) {
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

function loadNextMeeting(groupId) {
    axios.get(`/api/getGroupNextMeeting/${groupId}`)
    .then(res => {
        const divMeetingInfo = document.getElementById('meetingInfo');
        if(res.data.length == 0){
            divMeetingInfo.innerHTML = "There is no meeting information.";
            document.getElementById('timeList').innerHTML = "";
            document.getElementById('locationList').innerHTML = "";
        }else{
            for(var i=0; i < res.data.length; i++){
                if(res.data[i].type == "Time"){
                    document.getElementById('timeList').innerHTML = "Time: ";
                    addGroupTime(res.data[i].value1, res.data[i].value2, res.data[i].value3, 1, res.data[i].isSelected);
                }else if(res.data[i].type == "Location"){
                    document.getElementById('locationList').innerHTML = "Location: ";
                    addLocation(res.data[i].value0, res.data[i].isSelected, 1);
                }
            }
        }
    });   
}

function loadGroupMeeting(groupId) {
    axios.get(`/api/getGroupAvailableTime/${groupId}`)
    .then(res => {
        const divTimeList = document.getElementById('timeList');
        if(res.data.length == 0){
            divTimeList.innerHTML = "There are no available time.";
        }else{
            for(var i=0; i < res.data.length; i++){
                addGroupTime(res.data[i].day, res.data[i].time, res.data[i].time+1, res.data[i].count, 0);
            }
        }
    });   
}

function loadSavedGroupMeeting(groupId) {
    axios.get(`/api/getGroupSavedMeeting/${groupId}`)
    .then(res => {
        for(var i=0; i < res.data.length; i++){
            if(res.data[i].type == "Time"){
                if(res.data[i].memCount > 0 && res.data[i].isSelected == 1){
                    const radioValue = res.data[i].value1 + "|" + res.data[i].value2 + "|" + res.data[i].value3;
                    const radioElement = document.querySelector(`.meeting-radio-time[value='${radioValue}']`);
                    radioElement.checked = true;
                }else if(res.data[i].memCount == 0){
                    addGroupTime(res.data[i].value1, res.data[i].value2, res.data[i].value3, 0, res.data[i].isSelected);
                }
            }else if(res.data[i].type == "Location"){
                addLocation(res.data[i].value0, res.data[i].isSelected);
            }
        }
    });   
}

function deleteTime() {
    const images = document.querySelectorAll('.available-frame img');

    images.forEach((image, index) => {
    image.addEventListener('click', function(event) {
        // const userAnswer = askYesNoQuestion("Do you want to delete data?");
        // if (userAnswer) {
            const clickedImage = event.target;
            const parentDiv = clickedImage.parentElement;

            const meetingSelect = parentDiv.getElementsByClassName('meeting-select');
            const timeStart = parentDiv.getElementsByClassName('time-start');
            const timeEnd = parentDiv.getElementsByClassName('time-end');
            if(meetingSelect != null && timeStart != null && timeEnd != null){
                data = {
                    groupId: groupId,
                    type: "Time",
                    value0: null,
                    value1: meetingSelect[0].value,
                    value2: timeStart[0].value,
                    value3: timeEnd[0].value
                }
            }
            
            axios.post(`/api/group_meeting_delete`, data)
            .then(res => {
                if(res && res.data && res.data.success) {
                    parentDiv.remove();
                }
            });
        // }
        });
    });
}

function deleteLocation() {
    const images = document.querySelectorAll('.available-frame img');

    images.forEach((image, index) => {
    image.addEventListener('click', function(event) {
        // const userAnswer = askYesNoQuestion("Do you want to delete data?");
        // if (userAnswer) {
            const clickedImage = event.target;
            const parentDiv = clickedImage.parentElement;

            const location = parentDiv.getElementsByClassName('location');
            if(location != null){
                data = {
                    groupId: groupId,
                    type: "Location",
                    value0: location[0].value,
                    value1: null,
                    value2: null,
                    value3: null
                }
            }
            
            axios.post(`/api/group_meeting_delete`, data)
            .then(res => {
                if(res && res.data && res.data.success) {
                    parentDiv.remove();
                }
            });
        // }
        });
    });
}


function saveMeeting() {
    if(meetingDataValidate()){
        const userAnswer = askYesNoQuestion("Do you want to save your data?");
        if (userAnswer) {
            const selectInputs = document.getElementsByClassName('meeting-select');
            const startInputs = document.getElementsByClassName('time-start');
            const endInputs = document.getElementsByClassName('time-end');
            const countInputs = document.getElementsByClassName('meeting-count');
            const radioTimeInputs = document.getElementsByClassName('meeting-radio-time');

            var days = {};
            for (let i = 0; i < selectInputs.length; i++) {
                const day = parseInt(selectInputs[i].value);
                const startValue = parseInt(startInputs[i].value);
                const endValue = parseInt(endInputs[i].value);
                const radioValue = radioTimeInputs[i].checked;

                days[i] = days[i] || [];
                days[i].push(day);
                days[i].push(startValue);
                days[i].push(endValue);
                days[i].push(radioValue);
                if(countInputs[i] != null) {
                    const countValue = parseInt(countInputs[i].value);
                    days[i].push(countValue);
                }else{
                    days[i].push(0);
                }
            }

            const locationInputs = document.getElementsByClassName('location');
            const radioLocationInputs = document.getElementsByClassName('meeting-radio-location');
            var locations = {};
            for (let i = 0; i < locationInputs.length; i++) {
                const location = locationInputs[i].value;
                const radioValue = radioLocationInputs[i].checked;

                locations[i] = locations[i] || [];
                locations[i].push(location);
                locations[i].push(radioValue);
            }

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            groupId = urlParams.get('gi');

            const data = {
                groupId: groupId,
                days: days,
                locations: locations,
            }
        
            axios.post(`/api/group_meeting_save`, data)
                .then(res => {
                    if(res && res.data && res.data.success) {
                        alert("Meeting information successfully saved!");
                        location.reload();
                    }
                });
        }
    }
}

function meetingDataValidate() {
    const selectInputs = document.getElementsByClassName('meeting-select');
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
          endInputs[i].focus();
          return false;
        }
        if(end <= start){
          alert("End time should be greater than start time.");
          endInputs[i].focus();
          return false;
        }
      }

      const locationInputs = document.getElementsByClassName('location');
  
      for (let i = 0; i < locationInputs.length; i++) {
        const location = locationInputs[i].value;
        if(location == ""){
          alert("Please enter location.");
          locationInputs[i].focus();
          return false;
        }
      }

      return true;
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

    if(currentPagePath == 'group_detail.html' || currentPagePath == 'course_group_view.html'){
        loadGroupInfo();
        loadNextMeeting(groupId);
    }else if(currentPagePath == 'group_meeting.html'){
        loadGroupMeeting(groupId);
        loadSavedGroupMeeting(groupId);
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

