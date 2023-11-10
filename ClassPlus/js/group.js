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
            divCourse.innerHTML = "There are no groups.";
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
            const message = "Successfully joined in " + subject + " " + courseNumber;
            alert(message);
            location.reload();
        }else if(res && res.data && res.data.alreadyJoined) {
            const message = "You're already joined in " + subject + " " + courseNumber;
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
    
    const btnEdit = document.getElementById('buttonForEdit');
    if(btnEdit != null) btnEdit.hidden = true;
    axios.post(`/api/getGroup/${groupId}`)
    .then(res => {
        if(res && res.data) {
            console.log(res.data);
            if(currentPagePath == 'group_detail.html'){
                if(btnEdit != null) btnEdit.hidden = false;
                document.getElementById('groupName').innerHTML = res.data[0].groupName;
                document.getElementById('groupDescription').innerHTML = ": " + res.data[0].description;
                document.getElementById('memberCount').innerHTML = res.data[0].members;

                axios.get(`/api/getGroupMembers/${groupId}`)
                .then(res => {
                    if(res && res.data) {
                        console.log(res.data);
                        var divMembers = document.getElementById('memberList');
                        for(var i=0; i < res.data.length; i++){
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
                            const btnFollow = document.createElement('button');
                            btnFollow.setAttribute('class', 'follow-button');
                            const divFollow = document.createElement('div');
                            divFollow.setAttribute('class', 'course-text');
                            divFollow.innerHTML = "Follow";
                            btnFollow.appendChild(divFollow);

                            divMembers.appendChild(divFrame);
                            divFrame.appendChild(divPicture);
                            divPicture.appendChild(imgPicture);
                            divFrame.appendChild(divMemberName);
                            divFrame.appendChild(btnFollow);
                        }
                    }
                });
            }
        }
    });
}

function loadGroupMeeting(data) {

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
        loadGroupMeeting(data);
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
