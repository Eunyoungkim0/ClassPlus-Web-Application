let data;
let subject;
let courseNumber;

//---------------------------------------------------------------------------------
// START OF FUNCTIONS FOR MY COURSE
function getMyCourse(){
    const userId = localStorage.getItem('userId');
    axios.get(`/api/getMyCourse/${userId}`)
    .then(res => {
        if(res.data.length == 0){
            var divCourse = document.createElement('div');
            divCourse.innerHTML = "There are no enrolled classes.";
            document.querySelector('.box').appendChild(divCourse);
        }else{
            for(var i=0; i < res.data.length; i++){
                var subject = res.data[i].subject;
                var courseNumber = res.data[i].courseNumber; 
                var title = res.data[i].title;
    
                var divCourse = document.createElement('div');
                var divCourseNumber = document.createElement('div');
                var divLine = document.createElement('div');
                var divTitle = document.createElement('div');
    
                divCourse.setAttribute('class', 'course-frame');
                divCourse.setAttribute('onclick', `gotoCourse('${subject}','${courseNumber}')`);
                divCourseNumber.setAttribute('class', 'course-number');
                divLine.setAttribute('class', 'course-line');
                divTitle.setAttribute('class', 'course-name');
    
                divCourseNumber.innerHTML = subject + courseNumber;
                divTitle.innerHTML = title;
    
                document.querySelector('.box').appendChild(divCourse);
                divCourse.appendChild(divCourseNumber);
                divCourse.appendChild(divLine);
                divCourse.appendChild(divTitle);
            }
        }
    });
}

function searchCourses() {

    const subject = document.getElementById('subjectSelect').value;
    const courseNumber = document.getElementById('classSelect').value;

    if(subject == ""){
        alert("Please select subject.");
        document.getElementById('subjectSelect').focus();
        return false;
    }

    const searchData = {
        subject : subject,
        courseNumber: courseNumber,
        limit : 0,
    };
    
    axios.post(`/api/getSearchedCourses`, searchData)
    .then(res => {
        if(res && res.data) {
            if(res.data.length == 0){
                document.getElementById('divForCourse').innerHTML = "There is no course with this information.";
            }else{
                // console.log(res.data);
                const divForCourse = document.getElementById('divForCourse');
                while (divForCourse.firstChild) {
                    divForCourse.removeChild(divForCourse.firstChild);
                }

                const divListFrame = document.createElement('div');
                divListFrame.setAttribute('class', 'result-frame');
                const divRowFrame = document.createElement('div');
                divRowFrame.setAttribute('class', 'list-row-frame-title');
                const divSubject = document.createElement('div');
                divSubject.innerHTML = "Subject";
                divSubject.setAttribute('class', 'list-subject')
                const divCourseNumber = document.createElement('div');
                divCourseNumber.innerHTML = "Course #";
                divCourseNumber.setAttribute('class', 'list-coursenumber')
                const divTitle = document.createElement('div');
                divTitle.innerHTML = "Title";
                divTitle.setAttribute('class', 'list-title');

                divForCourse.appendChild(divListFrame);
                divListFrame.appendChild(divRowFrame);
                divRowFrame.appendChild(divSubject);
                divRowFrame.appendChild(divCourseNumber);
                divRowFrame.appendChild(divTitle);

                for (var i = 0; i < res.data.length; i++) {
                    const rsSubject = res.data[i].subject;
                    const rsCourseNumber = res.data[i].courseNumber;
                    const rsTitle = res.data[i].title;

                    const divListFrame = document.createElement('div');
                    divListFrame.setAttribute('class', 'result-frame');
                    const divRowFrame = document.createElement('div');
                    divRowFrame.setAttribute('class', 'list-row-frame');
                    divRowFrame.setAttribute('onclick', `gotoCourse('${rsSubject}', '${rsCourseNumber}')`);
                    divRowFrame.setAttribute('style', 'cursor: pointer;');
                    const divSubject = document.createElement('div');
                    divSubject.innerHTML = rsSubject;
                    divSubject.setAttribute('class', 'list-subject')
                    const divCourseNumber = document.createElement('div');
                    divCourseNumber.innerHTML = rsCourseNumber;
                    divCourseNumber.setAttribute('class', 'list-coursenumber')
                    const divTitle = document.createElement('div');
                    divTitle.innerHTML = rsTitle;
                    divTitle.setAttribute('class', 'list-title');

                    divForCourse.appendChild(divListFrame);
                    divListFrame.appendChild(divRowFrame);
                    divRowFrame.appendChild(divSubject);
                    divRowFrame.appendChild(divCourseNumber);
                    divRowFrame.appendChild(divTitle);
                }
            }
        }
    });   
}

function gotoCourse(sj, cn) {
    const subject = sj;
    const courseNumber = cn;
    const url = `course_detail.html?sj=${subject}&cn=${courseNumber}`;
    window.location.href = url;
}

// END OF FUNCTIONS FOR MY COURSE
//---------------------------------------------------------------------------------


//---------------------------------------------------------------------------------
// START OF FUNCTIONS FOR COURSE HOMEPAGE

// This function is to check if a user is enrolled in the class,
// If the user is enrolled, it shows study sets and posting button.
// If the user is not enrolled, it shows enroll button.
function amIEnrolled(data) {
    axios.post(`/api/getPermission`, data)
        .then(res => {
            // console.log(res.data);

            if(res && res.data){
                const btnEnroll = document.getElementById('buttonForEnroll');
                const btnPost = document.getElementById('buttonForPosting');
                const btnStudySet = document.getElementById('buttonForStudySets');
                const btnGroup = document.getElementById('buttonForGroup');

                if(res.data.enrolled){
                    if(btnEnroll != null) btnEnroll.hidden = true;

                    if(res.data.blocked==1){
                        if(btnPost != null) btnPost.hidden = true;
                        if(btnStudySet != null) btnStudySet.hidden = true;
                        if(btnGroup != null) btnGroup.hidden = true;
                    }else{
                        if(btnPost != null) btnPost.hidden = false;
                        if(btnStudySet != null) btnStudySet.hidden = false;
                        if(btnGroup != null) btnGroup.hidden = false;
                    }
                }else{
                    if(btnEnroll != null) btnEnroll.hidden = false;
                    if(btnPost != null) btnPost.hidden = true;
                    if(btnStudySet != null) btnStudySet.hidden = true;
                    if(btnGroup != null) btnGroup.hidden = true;
                }

                if(res.data.status == 'TA' || res.data.status == 'instructor'){
                    if(res.data.status == 'TA'){
                        const divForTA = document.getElementById('isTA');
                        if(divForTA != null){
                            const imgTA = document.createElement('img');
                            imgTA.setAttribute('src', '../images/ta.png');
                            imgTA.setAttribute('height', 40);
                            divForTA.appendChild(imgTA);
                            divForTA.setAttribute('style', 'background-color: black; border-radius: 10px;');
                            divForTA.hidden = false;
                        }
                    }


                }
            }
      });
}


// This function executes when a user clicks enroll button.
function navigateToEnroll() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const enrollData = {
        userId: localStorage.getItem('userId'), 
        subject: urlParams.get('sj'),
        courseNumber: urlParams.get('cn'),
        instructor: localStorage.getItem('instructor')
    }
    axios.post(`/api/saveClass`, enrollData)
    .then(res => {
        if(res && res.data && res.data.success) {
            const message = "Successfully enrolled in " + subject + " " + courseNumber;
            alert(message);
            location.reload();
        }else if(res && res.data && res.data.alreadyEnrolled) {
            const message = "You're already enrolled in " + subject + " " + courseNumber;
            alert(message);
        }
    });   
}

// This function loads course subject, course number, and title.
function classInfo(data) {    
    axios.post(`/api/getClassInfo`, data)
    .then(res => {
        if(res && res.data) {
            const divCourseInfo = document.getElementById('courseInformation');
            divCourseInfo.innerHTML = "<img src='../images/course_bg.png' width=50 height=50 style='margin-right:10px;'>";
            divCourseInfo.innerHTML += subject + " " + courseNumber + " " + res.data[0].title;
            divCourseInfo.setAttribute('onclick', `gotoCourse('${subject}','${courseNumber}')`);
            divCourseInfo.setAttribute('title', 'Go to the course main page');
        }
    });            
}


function loadCoursePosts(data) {
    const userId = localStorage.getItem('userId');
    axios.post(`/api/getCoursePosts`, data)
    .then(res => {
        // console.log(res.data);
        if(res && res.data) {
            if(res.data.length == 0){
                document.getElementById('divForPost').innerHTML = "There is no post in this class yet.";
            }else{
                for(var i=0; i < res.data.length; i++){
                    if((res.data[i].blocked == 1 && res.data[i].blockedby == userId) || res.data[i].blocked != 1){
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
                        if(res.data[i].blocked == 1){
                            divElement1.setAttribute('style', 'color: red;');
                        }
                    }
                }
            }
        }
    });   
}

function loadCourseStudySets(data) {
    const userId = localStorage.getItem('userId');
    axios.post(`/api/getCourseStudySets`, data)
    .then(res => {
        if(res && res.data) {
            if(res.data.length == 0){
                document.getElementById('divForStudySet').innerHTML = "There is no study set in this class yet.";
            }else{
                for(var i=0; i < res.data.length; i++){
                    if((res.data[i].blocked == 1 && res.data[i].blockedby == userId) || res.data[i].blocked != 1){
                        var divElement1 = document.createElement('div');
                        divElement1.setAttribute('class', 'post-frame');
                        divElement1.setAttribute('onclick', `loadPost('StudySet', ${res.data[i].activityId})`);

                        var divElement2 = document.createElement('div');
                        divElement2.setAttribute('class', 'post-title');
                        divElement2.innerHTML = res.data[i].title;
                        var divElement3 = document.createElement('div');
                        divElement3.setAttribute('class', 'post-username');
                        divElement3.innerHTML = res.data[i].firstName + " " + res.data[i].lastName.charAt(0);
                        var divElement4 = document.createElement('div');
                        divElement4.setAttribute('class', 'post-time');
                        var fullDate = res.data[i].date;
                        const dateObj = new Date(fullDate);
                        const formattedDate = dateObj.toLocaleDateString();
                        divElement4.innerHTML = formattedDate;
                        
                        document.getElementById('divForStudySet').appendChild(divElement1);
                        divElement1.appendChild(divElement2);
                        divElement1.appendChild(divElement3);
                        divElement1.appendChild(divElement4);
                        if(res.data[i].blocked == 1){
                            divElement1.setAttribute('style', 'color: red;');
                        }
                    }
                }
            }
        }
    });   
}

function loadCourseGroups(data) {
    const userId = localStorage.getItem('userId');
    axios.post(`/api/getCourseGroups`, data)
    .then(res => {
        if(res && res.data) {
            if(res.data.length == 0){
                document.getElementById('divForGroup').innerHTML = "There is no group in this class yet.";
            }else{
                for(var i=0; i < res.data.length; i++){
                    if((res.data[i].blocked == 1 && res.data[i].blockedby == userId) || res.data[i].blocked != 1){
                        var divElement1 = document.createElement('div');
                        divElement1.setAttribute('class', 'group-frame');
                        divElement1.setAttribute('onclick', `loadPost('Group', ${res.data[i].groupId})`);

                        var divElement2 = document.createElement('div');
                        divElement2.setAttribute('class', 'group-title');
                        divElement2.innerHTML = res.data[i].groupName;

                        var divElement3 = document.createElement('div');
                        divElement3.setAttribute('class', 'group-description');
                        divElement3.innerHTML = res.data[i].description;
                        var divElement4 = document.createElement('div');
                        divElement4.setAttribute('class', 'group-course');
                        divElement4.innerHTML = res.data[i].subject + res.data[i].courseNumber +" : " + res.data[i].title;

                        var divElement5 = document.createElement('div');
                        divElement5.setAttribute('class', 'group-member');
                        divElement5.innerHTML = res.data[i].member + " people are in this group.";
                        
                        document.getElementById('divForGroup').appendChild(divElement1);
                        divElement1.appendChild(divElement2);
                        divElement1.appendChild(divElement3);
                        divElement1.appendChild(divElement4);
                        divElement1.appendChild(divElement5);
                        if(res.data[i].blocked == 1){
                            divElement1.setAttribute('style', 'color:red;');
                        }
                    }
                }
            }
        }
    });   
}

function getCoursePeople(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const courseInfo = {
        subject : urlParams.get('sj'),
        courseNumber : urlParams.get('cn')
    }

    axios.post(`/api/getCoursePeople`, courseInfo)
    .then(res => {
        if(res && res.data) {
            if(res.data.length == 0){
                document.getElementById('divForPeople').innerHTML = "There is no people in this course yet.";
            }else{
                for(var i=0; i < res.data.length; i++){
                    var divElement1 = document.createElement('div');
                    divElement1.setAttribute('class', 'people-frame');
                    if(res.data[i].status == 'TA'){
                        divElement1.setAttribute('style', 'color: blue;');
                    }else if(res.data[i].status == 'instructor'){
                        divElement1.setAttribute('style', 'color: #004F34; font-weight:bold;');
                    }

                    var divElement2 = document.createElement('div');
                    divElement2.setAttribute('class', 'people-picture');
                    var imgElement = document.createElement('img');
                    var picture = res.data[i].picture;
                    if(picture == null){
                        picture = 'basicProfileImage.png';
                    }
                    imgElement.setAttribute('src', `../images/${picture}`);
                    imgElement.setAttribute('style', 'width: 40px; height:40px;');
                    divElement2.appendChild(imgElement);

                    var divElement3 = document.createElement('div');
                    divElement3.setAttribute('class', 'people-name');
                    divElement3.innerHTML = res.data[i].firstName + " " + res.data[i].lastName;

                    var divElement4 = document.createElement('div');
                    divElement4.setAttribute('class', 'people-email');
                    divElement4.innerHTML = res.data[i].email;

                    var divElement5 = document.createElement('div');
                    divElement5.setAttribute('class', 'people-activity');
                    divElement5.innerHTML = res.data[i].count_activity;

                    var divElement6 = document.createElement('div');
                    divElement6.setAttribute('class', 'people-group');
                    divElement6.innerHTML = res.data[i].count_group;
                    
                    var divElement7 = document.createElement('div');
                    divElement7.setAttribute('class', 'people-role');
                    var divUserId = document.createElement('div');
                    divUserId.setAttribute('class', 'user-id');
                    divUserId.innerHTML = res.data[i].userId;
                    divUserId.hidden = true;
                    var selectElement = document.createElement('select');
                    selectElement.setAttribute('class', 'people-select');
                    if(localStorage.getItem('instructor')!= 1){
                        selectElement.disabled = true;
                    }
                    var optionElement1 = document.createElement('option');
                    optionElement1.value = 'student';
                    optionElement1.innerHTML = 'student';
                    var optionElement2 = document.createElement('option');
                    optionElement2.value = 'TA';
                    optionElement2.innerHTML = 'TA';
                    var optionElement3 = document.createElement('option');
                    optionElement3.value = 'instructor';
                    optionElement3.innerHTML = 'instructor';
                    divElement7.appendChild(selectElement);
                    selectElement.appendChild(optionElement1);
                    selectElement.appendChild(optionElement2);
                    selectElement.appendChild(optionElement3);
                    divElement7.appendChild(divUserId);
                    const status = res.data[i].status
                    selectElement.value = status;
                    if(selectElement.value == 'instructor'){
                        selectElement.disabled = true;
                    }else{
                        optionElement3.hidden = true;
                        selectElement.addEventListener("change", function(event) {
                            const selectedValue = event.target.value;
                            const targetElement = event.target;
                            const originalValue = status;
                            const parentDiv = event.target.parentElement;
                            const clickedUserId = parentDiv.getElementsByClassName('user-id')[0].innerText;
                            changeStatus(clickedUserId, selectedValue, targetElement, originalValue);
                        });
                    }

                    var divElement8 = document.createElement('div');
                    divElement8.setAttribute('onchange', 'people-button');
                    const userId = localStorage.getItem('userId');

                    if(res.data[i].status!='instructor' && res.data[i].userId != userId){
                        var buttonBlock = document.createElement('button');
                        var divBlock = document.createElement('div');
                        divBlock.setAttribute('class', 'block-text');
                        if(res.data[i].blocked==0){
                            buttonBlock.setAttribute('class','block-button');
                            divBlock.innerHTML = 'Block';
                            buttonBlock.addEventListener("click", function(event) {
                                const parentDiv = event.target.parentElement;
                                const grandparentDiv = parentDiv.parentElement;
                                const grandgrandparentDiv = grandparentDiv.parentElement;
                                const roleDiv = grandgrandparentDiv.querySelector('.people-role');
                                const clickedUserId = roleDiv.querySelector('.user-id').innerText;
                                blockPeople(clickedUserId, 1);
                            });
                        }else{
                            buttonBlock.setAttribute('class','unblock-button');
                            divBlock.innerHTML = 'Unblock';
                            buttonBlock.addEventListener("click", function(event) {
                                const parentDiv = event.target.parentElement;
                                const grandparentDiv = parentDiv.parentElement;
                                const grandgrandparentDiv = grandparentDiv.parentElement;
                                const roleDiv = grandgrandparentDiv.querySelector('.people-role');
                                const clickedUserId = roleDiv.querySelector('.user-id').innerText;
                                blockPeople(clickedUserId, 0);
                            });
                        }
                        buttonBlock.appendChild(divBlock);
                        divElement8.appendChild(buttonBlock);
                    }
                    
                    document.getElementById('divForPeople').appendChild(divElement1);
                    divElement1.appendChild(divElement2);
                    divElement1.appendChild(divElement3);
                    divElement1.appendChild(divElement4);
                    divElement1.appendChild(divElement5);
                    divElement1.appendChild(divElement6);
                    divElement1.appendChild(divElement7);
                    divElement1.appendChild(divElement8);
                }
            }
        }
    });   
}

function changeStatus(clickedUserId, status, targetElement, originalValue){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    subject = urlParams.get('sj');
    courseNumber = urlParams.get('cn');

    const userAnswer = askYesNoQuestion(`Change role to ${status}`);
    if (userAnswer) {
        const changeStatusData = {
            clickedUserId: clickedUserId,
            status: status,
            subject: subject,
            courseNumber: courseNumber,
            userId : localStorage.getItem('userId')
        }
        axios.post(`/api/changeUserStatus`, changeStatusData)
            .then(res => {
                if(res && res.data) {
                    alert("Role successfully changed!");
                    location.reload();
                }
            });
    }else{
        targetElement.value = originalValue;
    }
}

function blockPeople(clickedUserId, blocked){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    subject = urlParams.get('sj');
    courseNumber = urlParams.get('cn');
    var message = "";
    if(blocked==1){
        message = `Do you want to block the person?`;
        message2 = `Successfully blocked!`;
    }else{
        message = `Do you want to unblock the person?`;
        message2 = `Successfully unblocked!`;
    }

    const userAnswer = askYesNoQuestion(message);
    if (userAnswer) {
        const changeStatusData = {
            clickedUserId: clickedUserId,
            blocked: blocked,
            subject: subject,
            courseNumber: courseNumber,
            userId : localStorage.getItem('userId')
        }
        axios.post(`/api/blockPeople`, changeStatusData)
            .then(res => {
                if(res && res.data) {
                    alert(message2);
                    location.reload();
                }
            });
    }
}

function blockActivities(clickedActivityId, blocked){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    subject = urlParams.get('sj');
    courseNumber = urlParams.get('cn');
    var message = "";
    if(blocked==1){
        message = `Do you want to block this?`;
        message2 = `Successfully blocked!`;
    }else{
        message = `Do you want to unblock this?`;
        message2 = `Successfully unblocked!`;
    }

    const userAnswer = askYesNoQuestion(message);
    if (userAnswer) {
        const changeStatusData = {
            clickedActivityId: clickedActivityId,
            blocked: blocked,
            subject: subject,
            courseNumber: courseNumber,
            userId : localStorage.getItem('userId')
        }
        axios.post(`/api/blockActivities`, changeStatusData)
            .then(res => {
                if(res && res.data) {
                    alert(message2);
                    location.reload();
                }
            });
    }
}

// This function executes in the course homepage.
function loadCourseHomepage(currentPagePath){
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    subject = urlParams.get('sj');
    courseNumber = urlParams.get('cn');
    groupId = urlParams.get('gi');

    if(subject == "" || courseNumber== ""){
        alert("The wrong approach.");
        location.replace("mycourse.html");
    }

    data = {
        userId : localStorage.getItem('userId'),
        subject : subject,
        courseNumber: courseNumber,
        limit : 0,
        instructor: localStorage.getItem('instructor'),
    };

    classInfo(data);
    amIEnrolled(data);

    if(currentPagePath == 'course_detail.html'){
        data.limit = 8;
        loadCoursePosts(data);
        loadCourseStudySets(data);
        loadCourseGroups(data);
    }else if(currentPagePath == 'course_Post.html'){
        loadCoursePosts(data);
    }else if(currentPagePath == 'course_StudySet.html'){
        loadCourseStudySets(data);
    }else if(currentPagePath == 'course_StudyGroup.html'){
        loadCourseGroups(data);
    }else if(currentPagePath == 'course_post_view.html'){
        getPostData();
    }else if(currentPagePath == 'course_post_edit.html'){
        getPostData();
    }else if(currentPagePath == 'course_study_set_view.html'){
        getStudySetData();
    }else if(currentPagePath == 'course_study_set_edit.html'){
        getStudySetData();
    }else if(currentPagePath == 'course_group_view.html'){
        getGroupData();
        loadNextMeeting(groupId);
    }else if(currentPagePath == 'course_People.html'){
        getCoursePeople();
    }
}


// END OF FUNCTIONS FOR COURSE HOMEPAGE
//---------------------------------------------------------------------------------



//---------------------------------------------------------------------------------
// START OF FUNCTIONS FOR COURSE SEARCH PAGE

// This function sets url according to course subject and number that a user selects, and directs to the url.
function gotoCoursePage(){
    subject = document.getElementById('subjectSelect').value;
    courseNumber = document.getElementById('classSelect').value;

    if(courseNumber == ""){
        alert("Please select class.");
        document.getElementById('classSelect').focus();
        return false;
    }

    const url = `course_detail.html?sj=${subject}&cn=${courseNumber}`;
    window.location.href = url;
}

// This function sets course number according to the subject that a user selects.
function handleSelectChange(selectElement) {
    const selectedValue = selectElement.value;
    const classes = document.getElementById('classSelect');
    for (let i = classes.options.length - 1; i >= 0; i--) {
        classes.remove(i);
    }

    axios.get(`/api/getClasses/${selectedValue}`)
    .then(res => {
        var option = document.createElement('option');
        document.querySelector('#classSelect').appendChild(option);

        for(var i=0; i < res.data.length; i++){
            var option = document.createElement('option');
            option.setAttribute('value', res.data[i].courseNumber);
            option.innerHTML = res.data[i].courseNumber + " " + res.data[i].title;
            document.querySelector('#classSelect').appendChild(option);
        }
    });
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

// END OF FUNCTIONS FOR COURSE SEARCH PAGE
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
// START OF FUNCTIONS FOR CREATING POST PAGE

function cancelPosting() {
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    subject = urlParams.get('sj');
    courseNumber = urlParams.get('cn');   
    
    const userAnswer = askYesNoQuestion("Do you want to cancel posting?\nYou might lose your data.");
    if (userAnswer) {
        if(subject == "" || courseNumber== ""){
            alert("The wrong approach.");
            location.replace("mycourse.html");
        }
        const url = "course_Post.html" + "?sj=" + subject + "&cn=" + courseNumber;
        window.location.href = url;
    }
}

function savePost() {
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    subject = urlParams.get('sj');
    courseNumber = urlParams.get('cn');
    var category = "Post";

    const postData = {
        subject: subject,
        courseNumber: courseNumber,
        category: category,
        subCategory: document.getElementById('Category').value,
        title: document.getElementById('posttitle').value,
        content: document.getElementById('postcontent').value,
        userId : localStorage.getItem('userId'),
    };

    const userAnswer = askYesNoQuestion("Do you want to save your data?");
    if (userAnswer) {
        axios.post(`/api/createPost`, postData)
            .then(res => {
                if(res && res.data && res.data.success) {
                    const url = "course_Post.html" + "?sj=" + subject + "&cn=" + courseNumber;
                    window.location.href = url;
                }
            });
    }
}

// END OF FUNCTIONS FOR CREATING POST PAGE
//---------------------------------------------------------------------------------

function editPost() {
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    activityId = urlParams.get('ai');

    const editData = {
        activityId: activityId,
        subCategory: document.getElementById('category').value,
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
    };

    const userAnswer = askYesNoQuestion("Do you want to save your data?");
    if (userAnswer) {
        axios.post(`/api/editPost`, editData)
            .then(res => {
                if(res && res.data && res.data.success) {
                    const url = "course_Post.html" + "?sj=" + subject + "&cn=" + courseNumber;
                    window.location.href = url;
                }
            });
    }
}


function loadPost(category, activityId){
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    subject = urlParams.get('sj');
    courseNumber = urlParams.get('cn');

    if(category == 'Post'){
        var url = `course_post_view.html?sj=${subject}&cn=${courseNumber}&ai=${activityId}`
        window.location.href = url;
    }else if(category == 'StudySet'){
        var url = `course_study_set_view.html?sj=${subject}&cn=${courseNumber}&ai=${activityId}`
        window.location.href = url;
    }else if(category == 'Group'){
        var url = `course_group_view.html?sj=${subject}&cn=${courseNumber}&gi=${activityId}`
        window.location.href = url;
    }
}

function getPostData() {
    // Get the query string from the URL
    const currentPagePath = window.location.pathname.substring(1);
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    const userId = localStorage.getItem('userId');
    activityId = urlParams.get('ai');
    
    const btnEdit = document.getElementById('buttonForEdit');
    if(btnEdit != null) btnEdit.hidden = true;

    axios.post(`/api/getPost/${activityId}`)
        .then(res => {
            if(res && res.data) {
                isBlocked = res.data[0].blocked;
                whoBlocked = res.data[0].blockedby;
                setBlockButton(isBlocked, whoBlocked);
                
                if(currentPagePath == 'course_post_view.html'){
                    var writerId = res.data[0].userId;
                    if(writerId == userId && btnEdit != null) btnEdit.hidden = false;
                    document.getElementById('category').innerHTML = "[" + res.data[0].subCategory + "]";
                    document.getElementById('title').innerHTML = res.data[0].title;
                    document.getElementById('content').innerHTML = res.data[0].content;
                    document.getElementById('views').innerHTML = res.data[0].views;
                    document.getElementById('userName').innerHTML = res.data[0].firstName + " " + res.data[0].lastName;
                    const date = formatDateString(res.data[0].date);
                    document.getElementById('date').innerHTML = date;
                    const postUpdate = formatDateString(res.data[0].postUpdate);
                    document.getElementById('postUpdate').innerHTML = postUpdate;
                }else if(currentPagePath == 'course_post_edit.html'){
                    document.getElementById('title').value = res.data[0].title;
                    document.getElementById('content').value = res.data[0].content;
                }
            }
        });
}

function setBlockButton(isBlocked, whoBlocked) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const subject = urlParams.get('sj');
    const courseNumber = urlParams.get('cn');
    const activityId = urlParams.get('ai');
    const userId = localStorage.getItem('userId');
    
    const checkData = {
        subject: subject,
        courseNumber: courseNumber,
        userId : userId
    }
    axios.post(`/api/checkStatus`, checkData)
        .then(res => {
            if(res && res.data) {
                const buttonForBlock = document.getElementById('buttonForBlock');
                if(buttonForBlock != null){
                    if(res.data.status=="instructor" || res.data.status=="TA" || userId == whoBlocked){
                        buttonForBlock.hidden=false;
                        if(isBlocked!=1){
                            buttonForBlock.setAttribute('class','block-button block-text');
                            buttonForBlock.innerHTML = 'Block';
                            buttonForBlock.addEventListener("click", function(event) {
                                blockActivities(activityId, 1);
                            });
                        }else{
                            buttonForBlock.setAttribute('class','unblock-button block-text');
                            buttonForBlock.innerHTML = 'Unblock';
                            buttonForBlock.addEventListener("click", function(event) {
                                blockActivities(activityId, 0);
                            });
                        }
                    }else{
                        buttonForBlock.hidden=true;
                    }
                }
            }
        });
}

function setGroupBlockButton(isBlocked, whoBlocked) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const groupId = urlParams.get('gi');
    const userId = localStorage.getItem('userId');

    data = {
        userId: userId,
        groupId: groupId
    };

    axios.post(`/api/getGroupInfo`, data)
        .then(res => {
            if (res && res.data) {
                const subject = res.data[0].subject;
                const courseNumber = res.data[0].courseNumber;

                const checkData = {
                    subject: subject,
                    courseNumber: courseNumber,
                    userId: userId
                };

                axios.post(`/api/checkStatus`, checkData)
                    .then(res => {
                        if (res && res.data) {
                            const buttonForBlock = document.getElementById('buttonForBlock');
                            if (buttonForBlock != null) {
                                if (res.data.status == "instructor" || res.data.status == "TA" || userId == whoBlocked) {
                                    buttonForBlock.hidden = false;
                                    if (isBlocked != 1) {
                                        buttonForBlock.setAttribute('class', 'block-button block-text');
                                        buttonForBlock.innerHTML = 'Block';
                                        buttonForBlock.addEventListener("click", function (event) {
                                            blockGroup(subject, courseNumber, groupId, 1);
                                        });
                                    } else {
                                        buttonForBlock.setAttribute('class', 'unblock-button block-text');
                                        buttonForBlock.innerHTML = 'Unblock';
                                        buttonForBlock.addEventListener("click", function (event) {
                                            blockGroup(subject, courseNumber, groupId, 0);
                                        });
                                    }
                                } else {
                                    buttonForBlock.hidden = true;
                                }
                            }
                        }
                    });
            }
        });
}

function getStudySetData() {
    // Get the query string from the URL
    const currentPagePath = window.location.pathname.substring(1);
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    const userId = localStorage.getItem('userId');
    activityId = urlParams.get('ai');
    
    const btnEdit = document.getElementById('buttonForEdit');
    if(btnEdit != null) btnEdit.hidden = true;

    axios.post(`/api/getStudySet/${activityId}`)
        .then(res => {
            if(res && res.data) {
                isBlocked = res.data.blocked;
                whoBlocked = res.data.blockedby;
                setBlockButton(isBlocked, whoBlocked);

                if(currentPagePath == 'course_study_set_view.html'){
                    var writerId = res.data.userId;
                    if(writerId == userId && btnEdit != null) btnEdit.hidden = false;
                    document.getElementById('title').innerHTML = res.data.title;
                    document.getElementById('views').innerHTML = res.data.views;
                    document.getElementById('userName').innerHTML = res.data.userName;
                    const date = formatDateString(res.data.postDate);
                    document.getElementById('date').innerHTML = date;
                    const postUpdate = formatDateString(res.data.postUpdate);
                    document.getElementById('postUpdate').innerHTML = postUpdate;

                    for(var i=0; i < res.data.results.length; i++){
                        const divFrame = document.createElement('div');
                        divFrame.setAttribute('class', 'studyset-frame');
                        const divTerm = document.createElement('div');
                        divTerm.setAttribute('class', 'term');
                        const divDefinition = document.createElement('div');
                        divDefinition.setAttribute('class', 'definition');

                        divTerm.innerHTML = res.data.results[i].term;
                        divDefinition.innerHTML = res.data.results[i].definition;

                        const divContent = document.getElementById('content');
                        divContent.appendChild(divFrame);
                        divFrame.appendChild(divTerm);
                        divFrame.appendChild(divDefinition);
                    }
                }else if(currentPagePath == 'course_study_set_edit.html'){
                    document.getElementById('title').value = res.data.title;
                    var count = 1;
                    for(var i=0; i < res.data.results.length; i++){
                        const divFrame = document.createElement('div');
                        divFrame.setAttribute('class', 'studyset-frame');
                        const divTerm = document.createElement('input');
                        divTerm.setAttribute('type', 'text');
                        divTerm.setAttribute('class', 'term');
                        const divDefinition = document.createElement('input');
                        divDefinition.setAttribute('type', 'textarea');
                        divDefinition.setAttribute('class', 'definition');

                        divTerm.value = res.data.results[i].term;
                        divDefinition.value = res.data.results[i].definition;

                        const divContent = document.getElementById('content');
                        divContent.appendChild(divFrame);
                        divFrame.appendChild(divTerm);
                        divFrame.appendChild(divDefinition);
                        count += 1;
                    }
                }
            }
        });
}

function getGroupData() {
    // Get the query string from the URL
    const currentPagePath = window.location.pathname.substring(1);
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    const userId = localStorage.getItem('userId');
    groupId = urlParams.get('gi');
    
    const btnGroup = document.getElementById('buttonForGroup');
    const btnTxtGroup = document.getElementById('buttonTextForGroup');
    btnGroup.hidden = true;
    axios.post(`/api/getGroup/${groupId}?userId=${userId}`)
    .then(res => {
        console.log(res.data);
        if(res && res.data) {
            const amIJoined = res.data[0].amIJoined;
            const amIEnrolled = res.data[0].amIEnrolled;
            isBlocked = res.data[0].blocked;
            whoBlocked = res.data[0].blockedby;
            setGroupBlockButton(isBlocked, whoBlocked);

            if(btnGroup != null && amIEnrolled == 1){
                if(amIJoined == 0) {
                    btnGroup.hidden = false;
                    btnGroup.setAttribute('onclick', "navigateToJoin()");
                    btnTxtGroup.innerHTML = 'Join';
                }else{
                    btnGroup.setAttribute('style', 'display: none;');
                }
            }
            document.getElementById('groupName').innerHTML = res.data[0].groupName;
            document.getElementById('groupDescription').innerHTML = ": " + res.data[0].description;
            document.getElementById('memberCount').innerHTML = res.data[0].members;

            axios.get(`/api/getGroupMembers/${groupId}?userId=${userId}`)
            .then(res => {
                // console.log(res.data);
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
                        if(res.data[i].status == 'instructor'){
                            divMemberName.innerHTML += "<img src='../images/instructor.png' height='21' style='margin-left:10px;'>";
                        }else if(res.data[i].status == 'TA'){
                            divMemberName.innerHTML += "<img src='../images/ta.png'  height='21' style='margin-left:10px;'>";
                        }

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

function blockGroup(subject, courseNumber, groupId, blocked){

    userId = localStorage.getItem('userId');

    data = {userId,
        groupId};

    axios.post(`/api/getGroupInfo`, data)
        .then(res=>{
            if(res && res.data){
                subject = res.data[0].subject;
                courseNumber = res.data[0].courseNumber;
            }
        });

    var message = "";
    if(blocked==1){
        message = `Do you want to block this group?`;
        message2 = `Successfully blocked!`;
    }else{
        message = `Do you want to unblock this group?`;
        message2 = `Successfully unblocked!`;
    }

    const userAnswer = askYesNoQuestion(message);
    if (userAnswer) {
        const blockGroupData = {
            groupId: groupId,
            blocked: blocked,
            subject: subject,
            courseNumber: courseNumber,
            userId : userId
        }
        axios.post(`/api/blockGroups`, blockGroupData)
            .then(res => {
                if(res && res.data) {
                    alert(message2);
                    location.reload();
                }
            });
    }
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

function navigateToJoin() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    groupId = urlParams.get('gi');
    const joinData = {
        userId : localStorage.getItem('userId'),
        groupId : groupId
    }
    axios.post(`/api/joinGroup`, joinData)
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

function followFriend(userId, friendId) {
    axios.post(`/api/followFriend/${userId}?friendId=${friendId}`)
    .then(res => {
        if(res && res.data && res.data.success) {
            const message = "Great! You have one more friend!";
            alert(message);
            location.reload();
        }
    });   
}

function dataCheckForGroup() {
    if(document.getElementById('title').value == ""){
        alert("Please enter group name.");
        document.getElementById('title').focus();
        return false;
    }
    return true;
}

function saveGroup() {
    if(dataCheckForGroup()){
        const groupInformation = {
            groupName : document.getElementById('title').value,
            groupDescription : document.getElementById('description').value,
            subject : subject,
            courseNumber : courseNumber,
            userId : localStorage.getItem('userId'),
        }
        
        const userAnswer = askYesNoQuestion("Do you want to save your data?");
        if (userAnswer) {
            axios.post(`/api/createGroup`, groupInformation)
                .then(res => {
                    if(res && res.data && res.data.success) {
                        const url = "course_StudyGroup.html" + "?sj=" + subject + "&cn=" + courseNumber;
                        window.location.href = url;
                    }
                });
        }
    }
}

function addStudySet() {
    const divFrame = document.createElement('div');
    divFrame.setAttribute('class', 'studyset-frame');
    const divTerm = document.createElement('input');
    divTerm.setAttribute('type', 'text');
    divTerm.setAttribute('class', 'term');
    divTerm.setAttribute('placeholder', 'term');
    const divDefinition = document.createElement('input');
    divDefinition.setAttribute('type', 'textarea');
    divDefinition.setAttribute('class', 'definition');
    divDefinition.setAttribute('placeholder', 'definition');

    const divContent = document.getElementById('content');
    divContent.appendChild(divFrame);
    divFrame.appendChild(divTerm);
    divFrame.appendChild(divDefinition);
}

function dataCheckForStudySet() {
    if(document.getElementById('title').value == ""){
        alert("Please enter title");
        document.getElementById('title').focus();
        return false;
    }
    const termInputs = document.getElementsByClassName('term');
    const definitionInputs = document.getElementsByClassName('definition');
    for (let i = 0; i < termInputs.length; i++) {
      const term = termInputs[i].value;
      const definition = definitionInputs[i].value;
      if(term == ""){
        alert("Please enter term.");
        termInputs[i].focus();
        return false;
      }
      if(definition == ""){
        alert("Please enter definition.");
        definitionInputs[i].focus();
        return false;
      }
    }

    return true;
}

function saveStudySet() {
    if(dataCheckForStudySet()){
        // Get the query string from the URL
        const queryString = window.location.search;
        // Create a URLSearchParams object from the query string
        const urlParams = new URLSearchParams(queryString);
        subject = urlParams.get('sj');
        courseNumber = urlParams.get('cn');
        const userId = localStorage.getItem('userId');
    
        const termInputs = document.getElementsByClassName('term');
        const definitionInputs = document.getElementsByClassName('definition');
        const studySetData = [];
        for (let i = 0; i < termInputs.length; i++) {
          const term = termInputs[i].value;
          const definition = definitionInputs[i].value;
        
          const newDataItem = { term, definition };
          studySetData.push(newDataItem);
        }
    
        const studysetData = {
            title: document.getElementById('title').value,
            subject: subject,
            courseNumber: courseNumber,
            userId: userId,
            studySet : studySetData,
        };
        
        const userAnswer = askYesNoQuestion("Do you want to save your data?");
        if (userAnswer) {
            axios.post(`/api/createStudySet`, studysetData)
                .then(res => {
                    if(res && res.data && res.data.success) {
                        const url = "course_StudySet.html" + "?sj=" + subject + "&cn=" + courseNumber;
                        window.location.href = url;
                    }
                });
        }
    }
}

function editStudySet() {
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    activityId = urlParams.get('ai');

    const termInputs = document.getElementsByClassName('term');
    const definitionInputs = document.getElementsByClassName('definition');
    const studySetData = [];
    for (let i = 0; i < termInputs.length; i++) {
      const term = termInputs[i].value;
      const definition = definitionInputs[i].value;
    
      const newDataItem = { term, definition };
      studySetData.push(newDataItem);
    }

    const editData = {
        activityId: activityId,
        title: document.getElementById('title').value,
        studySet : studySetData,
    };

    const userAnswer = askYesNoQuestion("Do you want to save your data?");
    if (userAnswer) {
        axios.post(`/api/editStudySet`, editData)
            .then(res => {
                if(res && res.data && res.data.success) {
                    const url = "course_StudySet.html" + "?sj=" + subject + "&cn=" + courseNumber;
                    window.location.href = url;
                }
            });
    }
}

function gotoGroupPage() {
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    groupId = urlParams.get('gi');

    const url = "group_detail.html?gi=" + groupId;
    window.location.href = url;
}

// This function loads data depending on its page name.
function loadData(){
    const currentPagePath = window.location.pathname.substring(1);

    if(currentPagePath == 'mycourse.html'){
        getMyCourse();
    }else if(currentPagePath == 'course_search.html'){
        getSubject();
    }else{
        loadCourseHomepage(currentPagePath);
    }
}

loadData();
