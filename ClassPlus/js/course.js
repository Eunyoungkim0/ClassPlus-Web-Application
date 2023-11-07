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
        }

        for(var i=0; i < res.data.length; i++){
            var subject = res.data[i].subject;
            var courseNumber = res.data[i].courseNumber; 
            var title = res.data[i].title; 

            var divCourse = document.createElement('div');
            var divCourseNumber = document.createElement('div');
            var divTitle = document.createElement('div');

            divCourse.setAttribute('class', 'course-frame');
            divCourse.setAttribute('onclick', `gotoCourse('${subject}','${courseNumber}')`);
            divCourseNumber.setAttribute('class', 'course-number');
            divTitle.setAttribute('class', 'course-name');

            divCourseNumber.innerHTML = subject + courseNumber;
            divTitle.innerHTML = title;

            document.querySelector('.box').appendChild(divCourse);
            divCourse.appendChild(divCourseNumber);
            divCourse.appendChild(divTitle);
        }
    });
}

function gotoCourse(sj, cn) {
    const subject = sj;
    const courseNumber = cn;
    const url = `course_detail.html?sj=${subject}&cn=${courseNumber}`;
    window.location.href = url;
}

// END OF FUNCTIONS FOR COURSE HOMEPAGE
//---------------------------------------------------------------------------------


//---------------------------------------------------------------------------------
// START OF FUNCTIONS FOR COURSE HOMEPAGE

// This function is to check if a user is enrolled in the class,
// If the user is enrolled, it shows study sets and posting button.
// If the user is not enrolled, it shows enroll button.
function amIEnrolled(data) {
    axios.post(`/api/getPermission`, data)
        .then(res => {
            const btnEnroll = document.getElementById('buttonForEnroll');
            const btnPost = document.getElementById('buttonForPosting');
            const btnStudySet = document.getElementById('buttonForStudySets');
            const btnGroup = document.getElementById('buttonForGroup');

            if(res && res.data && res.data.enrolled) {
                if(btnEnroll != null) btnEnroll.hidden = true;
                if(btnPost != null) btnPost.hidden = false;
                if(btnStudySet != null) btnStudySet.hidden = false;
                if(btnGroup != null) btnGroup.hidden = false;
            }else if(res && res.data && !res.data.enrolled){
                if(btnEnroll != null) btnEnroll.hidden = false;
                if(btnPost != null) btnPost.hidden = true;
                if(btnStudySet != null) btnStudySet.hidden = true;
                if(btnGroup != null) btnGroup.hidden = true;
            }
      });
}


// This function executes when a user clicks enroll button.
function navigateToEnroll() {
    axios.post(`/api/saveClass`, data)
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
            document.getElementById('courseInformation').innerHTML = subject + " " + courseNumber + " " + res.data[0].title;
            document.getElementById('courseInformation').setAttribute('onclick', `gotoCourse('${subject}','${courseNumber}')`);
        }
    });            
}


function loadCoursePosts(data) {
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
                    
                    document.getElementById('divForPost').appendChild(divElement1);
                    divElement1.appendChild(divElement2);
                    divElement1.appendChild(divElement3);
                    divElement1.appendChild(divElement4);
                }
            }
        }
    });   
}

function loadCourseStudySets(data) {
    axios.post(`/api/getCourseStudySets`, data)
    .then(res => {
        if(res && res.data) {
            if(res.data.length == 0){
                document.getElementById('divForStudySet').innerHTML = "There is no study set in this class yet.";
            }else{
                for(var i=0; i < res.data.length; i++){
                    var divElement1 = document.createElement('div');
                    divElement1.setAttribute('class', 'post-frame');

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
                }
            }
        }
    });   
}

function loadCourseGroups(data) {
    axios.post(`/api/getCourseGroups`, data)
    .then(res => {
        if(res && res.data) {
            if(res.data.length == 0){
                document.getElementById('divForGroup').innerHTML = "There is no group in this class yet.";
            }else{
                for(var i=0; i < res.data.length; i++){
                    var divElement1 = document.createElement('div');
                    divElement1.setAttribute('class', 'group-frame');

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
                }
            }
        }
    });   
}


// This function executes in the course homepage.
function loadCourseHomepage(currentPagePath){
    // Get the query string from the URL
    const queryString = window.location.search;
    // Create a URLSearchParams object from the query string
    const urlParams = new URLSearchParams(queryString);
    subject = urlParams.get('sj');
    courseNumber = urlParams.get('cn');

    if(subject == "" || courseNumber== ""){
        alert("The wrong approach.");
        location.replace("course_page_searchpage.html");
    }

    data = {
        userId : localStorage.getItem('userId'),
        subject : subject,
        courseNumber: courseNumber,
        limit : 0,
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

    const data = {
        subject: subject,
        courseNumber: courseNumber,
        category: category,
        subCategory: document.getElementById('Category').value,
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        userId : localStorage.getItem('userId'),
    };

    const userAnswer = askYesNoQuestion("Do you want to save your data?");
    if (userAnswer) {
        axios.post(`/api/createPost`, data)
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

    const data = {
        activityId: activityId,
        subCategory: document.getElementById('category').value,
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
    };

    const userAnswer = askYesNoQuestion("Do you want to save your data?");
    if (userAnswer) {
        axios.post(`/api/editPost`, data)
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


// This function loads data depending on its page name.
function loadData(){
    const currentPagePath = window.location.pathname.substring(1);

    if(currentPagePath == 'mycourse.html'){
        getMyCourse();
    }else if(currentPagePath == 'course_page_searchpage.html'){
        getSubject();
    }else{
        loadCourseHomepage(currentPagePath);
    }
}

loadData();
