let data;
let subject;
let courseNumber;

//---------------------------------------------------------------------------------
// START OF FUNCTIONS FOR MY COURSE
function getMyCourse(){
    const userId = localStorage.getItem('userId');
    axios.get(`/api/getMyCourse/${userId}`)
    .then(res => {
        console.log(res.data);
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
            if(res && res.data && res.data.enrolled) {
                document.getElementById('buttonForEnroll').hidden = true;
                document.getElementById('buttonForStudySets').hidden = false;
                document.getElementById('buttonForPosting').hidden = false;
            }else if(res && res.data && !res.data.enrolled){
                document.getElementById('buttonForEnroll').hidden = false;
                document.getElementById('buttonForStudySets').hidden = true;
                document.getElementById('buttonForPosting').hidden = true;
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
            console.log(res);
            document.getElementById('courseInformation').innerHTML = subject + " " + courseNumber + " " + res.data[0].title
        }
    });            
}

// This function executes in the course homepage.
function loadCourseHomepage(){
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
    };

    classInfo(data);
    amIEnrolled(data);
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



// This function loads data depending on its page name.
function loadData(){
    const currentPagePath = window.location.pathname.substring(1);

    if(currentPagePath == 'mycourse.html'){
        getMyCourse();
    }else if(currentPagePath == 'course_page_searchpage.html'){
        getSubject();
    }else if(currentPagePath == 'course_detail.html'){
        loadCourseHomepage();
    }
}

loadData();
