// If the page needs login, it checks login information.
// If login information does not exist, it directs to login.html page.
function needsLogin(userId) {
    const currentPagePath = window.location.pathname.substring(1);
    axios.get(`/api/checkLogin/${currentPagePath}`)
            .then(res => {
                if(res && res.data && res.data.success) {
                    if(res.data.needsLogin == 1 && (!userId || userId === undefined)){
                        location.replace('login.html');
                    }
                }
            });
}

// If login information exists, it shows log out button.
// If login information does not exist, it show log in button.
function setLoginButton(userId) {
    const linkElement = document.getElementById('linkforloginout');
    linkElement.innerHTML = "Log"
    if(!userId || userId === undefined){
        linkElement.innerHTML += "in";
        linkElement.href = 'login.html';
        localStorage.setItem('didLogin', 'n');
    }else{
        linkElement.innerHTML += " out";
        localStorage.setItem('didLogin', 'y');
        linkElement.href = '#';
        linkElement.onclick = function() {
            localStorage.removeItem('userId');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('instructor');
            amIInstructor();
            location.replace('index.html');
            localStorage.setItem('didLogin', 'n');
        };
    }
}

// It asks Yes/No question and returns user's response.
function askYesNoQuestion(question) {
    const userResponse = window.confirm(question);
    return userResponse;
}

// For nav, this function checks if login information exists.
// If login information does not exist, it direct to login page before going to the page.
function loginCheckBeforeNav(page){
    const didLogin = localStorage.getItem('didLogin');
    if (didLogin == 'y'){
        location.replace(page);
    }else{
        localStorage.setItem('destination', page);
        location.replace('login.html');
    }
}

// This function checks if a user is an instructor.
function amIInstructor(){
    const instructorMark = document.getElementById('amIInstructor');
    const instructor = localStorage.getItem('instructor');
    if(instructor == 1){
        instructorMark.setAttribute('style','visibility: visible;');
        // instructorMark.innerHTML = 'Instructor View';
        instructorMark.innerHTML = "<img src='../images/instructor.png' height='21'>";
    }else{
        instructorMark.setAttribute('style','visibility: hidden;');
    }
}

// This function is for formatting date
function formatDateString(dateString) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/New_York'
    };
  
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options).replace(/,/g, '');
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function addGroupTime(day=0, start=0, end=0, count=0, isSelected=0){
    const currentPagePath = window.location.pathname.substring(1);
    var readonlyValue = false;
    if(currentPagePath == "group_detail.html" || currentPagePath == "course_group_view.html"){
        readonlyValue = true;
    }

    const divTimeList = document.getElementById('timeList');

    const divFrame = document.createElement('div');
    divFrame.setAttribute('class', 'available-frame');

    const labelRadio = document.createElement('label');
    labelRadio.setAttribute('class', 'radio-container');
    const radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'time');
    radio.setAttribute('class', 'meeting-radio-time');
    const radioValue = day + "|" + start + "|" + end;
    radio.setAttribute('value', `${radioValue}`);
    if(isSelected == 1){
        radio.checked = true;
    }
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
    if(day > 0){
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
        inputStart.value = start;
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
    if(count > 0) {
        inputEnd.value = start + 1;
        inputEnd.disabled = true;
    }else{
        if(end > 0) {
            inputEnd.value = end;
            inputEnd.disabled = true;
        }
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

    if(readonlyValue == false){
        if(count > 0) {
            const spanCount = document.createElement('span');
            spanCount.setAttribute('class', 'available-people');
            spanCount.innerHTML = count + " people are available at this time."
            const inputCount = document.createElement('input');
            inputCount.setAttribute('type', 'number');
            inputCount.setAttribute('class', 'meeting-count');
            inputCount.setAttribute('value', `${count}`);
            inputCount.disabled = true;
            inputCount.hidden = true;
            divFrame.appendChild(spanCount);
            divFrame.appendChild(inputCount);
        }else {
            if(joined == 1){
                const deleteTime = document.createElement('img');
                deleteTime.setAttribute('src', '../images/delete.png');
                deleteTime.setAttribute('style', 'width: 25px; height: 25px; cursor: pointer; margin-left: 20px;');
                deleteTime.setAttribute('onclick', 'deleteTime()');
                divFrame.appendChild(deleteTime);
            }
        }
    }
    
    if(readonlyValue == true || joined == 0){
        radio.disabled = true;
        selectDay.disabled = true;
        inputStart.disabled = true;
        inputEnd.disabled = true;
    }
}

function addLocation(location="", isSelected=0) {
    const currentPagePath = window.location.pathname.substring(1);
    var readonlyValue = false;
    if(currentPagePath == "group_detail.html" || currentPagePath == "course_group_view.html"){
        readonlyValue = true;
    }

    const divLocationList = document.getElementById('locationList');

    const divFrame = document.createElement('div');
    divFrame.setAttribute('class', 'available-frame');

    const labelRadio = document.createElement('label');
    labelRadio.setAttribute('class', 'radio-container');
    const radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'location');
    radio.setAttribute('class', 'meeting-radio-location');
    if(isSelected == 1){
        radio.checked = true;
    }
    const spanRadio = document.createElement('span');
    spanRadio.setAttribute('class', 'checkmark');

    labelRadio.appendChild(radio);
    labelRadio.appendChild(spanRadio);


    const inputLocation = document.createElement('input');
    inputLocation.setAttribute('type', 'text');
    inputLocation.setAttribute('class', 'location');
    if(location != ""){
        inputLocation.value = location;
        inputLocation.disabled = true;
    }
    
    divLocationList.appendChild(divFrame);
    divFrame.appendChild(labelRadio);
    divFrame.appendChild(inputLocation);

    if(readonlyValue == false && joined == 1){
        const deleteTime = document.createElement('img');
        deleteTime.setAttribute('src', '../images/delete.png');
        deleteTime.setAttribute('style', 'width: 25px; height: 25px; cursor: pointer; margin-left: 20px;');
        deleteTime.setAttribute('onclick', 'deleteLocation()');
        divFrame.appendChild(deleteTime);
    }

    if(readonlyValue == true || joined == 0){
        radio.disabled = true;
        inputLocation.disabled = true;
    }
}

function help() {
    const currentPagePath = window.location.pathname.substring(1);
    const page = currentPagePath.split('.');

    const navBar = document.getElementById('navbar');
    const checkHelp = document.getElementById('tutorial-frame');

    if(!checkHelp){
        const divTutorialFrame = document.createElement('div');
        divTutorialFrame.setAttribute('class', 'tutorial-frame');
        divTutorialFrame.setAttribute('id', 'tutorial-frame');
        const divTutorial = document.createElement('div');
        divTutorial.setAttribute('class', 'tutorial');
        const divClose = document.createElement('div');
        divClose.setAttribute('class', 'tutorial-close');
        const imgClose = document.createElement('img');
        imgClose.setAttribute('src', '../images/delete.png');
        imgClose.setAttribute('width', '40');
        imgClose.setAttribute('style', 'cursor: pointer;');
        imgClose.setAttribute('onclick', 'deleteTutorial()');
        divTutorialFrame.appendChild(divTutorial);
        divTutorial.appendChild(divClose);
        divClose.appendChild(imgClose);
        const divImgFrame = document.createElement('div');
        divImgFrame.setAttribute('class', 'page-image');
        const imgTutorial = document.createElement('img');
    
        if(currentPagePath == "index.html" || currentPagePath == "") {
            const userId = localStorage.getItem('userId');
            if(userId){
                imgTutorial.setAttribute('src', '../images/help/index-logout.jpg');
            } else {
                imgTutorial.setAttribute('src', '../images/help/index-login.jpg');
            }
        }else{
            imgTutorial.setAttribute('src', `../images/help/${page[0]}.jpg`);
        }
        divImgFrame.appendChild(imgTutorial);
        imgTutorial.setAttribute('style', 'width: 90%; border: 1px #004F34 solid; border-radius: 10px; box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;');
        divTutorial.appendChild(divImgFrame);
        navBar.insertAdjacentElement('afterend', divTutorialFrame);
    }
}

function deleteTutorial() {
    const divTutorial = document.getElementById('tutorial-frame');
    divTutorial.remove();
}

// When the page loads, this function executes.
function onLoad() {
    const userId = localStorage.getItem('userId');
    needsLogin(userId);
    setLoginButton(userId);
    amIInstructor();
}

onLoad();