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


function loadGroupInfo(data) {
    axios.post(`/api/getCoursePosts`, data)
    .then(res => {
        if(res && res.data) {
            console.log(res.data);
            if(res.data.length == 0){
                document.getElementById('divForPost').innerHTML = "There is no post in this class yet.";
            }else{
                for(var i=0; i < res.data.length; i++){
                    var divElement1 = document.createElement('div');
                    divElement1.setAttribute('class', 'post-frame');
                    divElement1.setAttribute('onclick', `loadPost('Post', ${res.data[i].activityId})`);

                    var divElement2 = document.createElement('div');
                    divElement2.setAttribute('class', 'post-title');
                    divElement2.innerHTML = "[" + res.data[i].subCategory + "] " + res.data[i].title;
                    var divElement3 = document.createElement('div');
                    divElement3.setAttribute('class', 'post-username');
                    divElement3.innerHTML = res.data[i].firstName + " " + res.data[i].lastName.charAt(0);
                    var divElement4 = document.createElement('div');
                    divElement4.setAttribute('class', 'post-time');
                    var fullDate = res.data[i].date;
                    const dateObj = new Date(fullDate);
                    const formattedDate = dateObj.toLocaleDateString();
                    divElement4.innerHTML = formattedDate;
                    
                    document.getElementById('divForPost').appendChild(divElement1);
                    divElement1.appendChild(divElement2);
                    divElement1.appendChild(divElement3);
                    divElement1.appendChild(divElement4);
                }
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
        loadGroupInfo(data);
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
        loadGroupHomepage();
    }
}

loadData();
