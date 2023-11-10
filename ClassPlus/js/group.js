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
                divCourse.setAttribute('onclick', `gotoGroup('${subject}','${courseNumber}', '${groupId}')`);
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

function gotoGroup(sj, cn) {
    const subject = sj;
    const courseNumber = cn;
    const url = `course_detail.html?sj=${subject}&cn=${courseNumber}`;
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


// This function loads data depending on its page name.
function loadData(){
    const currentPagePath = window.location.pathname.substring(1);

    if(currentPagePath == 'mygroup.html'){
        getMyGroup();
    }else if(currentPagePath == 'group_search.html'){
        getSubject();
    }else{
    }
}

loadData();
