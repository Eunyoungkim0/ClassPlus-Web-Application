// This function is for input validation.
// It checks firstName, lastName, userPassword, unccId, email, major, status
function validationCheck(){
            
  if(document.getElementById('firstName').value == ""){
      alert("Please enter your first name");
      document.getElementById('firstName').focus();
      return false;
  }
  if(document.getElementById('lastName').value == ""){
      alert("Please enter your last name");
      document.getElementById('lastName').focus();
      return false;
  }
  if(document.getElementById('userPassword').value ==""){
      alert("Please enter your password");
      document.getElementById('userPassword').focus();
      return false;
  }
  if(document.getElementById('unccId').value == ""){
      alert("Please enter your UNCC ID");
      document.getElementById('unccId').focus();
      return false;
  }
  if(document.getElementById('email').value == ""){
      alert("Please enter your UNCC email address");
      document.getElementById('email').focus();
      return false;
  }else if(!document.getElementById('email').value.includes("@uncc.edu")){
      alert("Please use your UNCC email address.");
      document.getElementById('email').focus();
      return false;
  }
  if(document.getElementById('major').value == ""){
      alert("Please enter your major");
      document.getElementById('major').focus();
      return false;
  }
  if(!(document.getElementById('isStudent').checked || document.getElementById('isInstructor').checked)){
      alert("Please choose your status");
      return false;
  }

  return true;
}

// When user clicks signup button, this function executes.
// After validation check, it sends data to API.
function signup() {
  if(validationCheck()){
      const data = {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          userPassword: document.getElementById('userPassword').value,
          unccId: document.getElementById('unccId').value,
          email: document.getElementById('email').value,
          major: document.getElementById('major').value,
          minor: document.getElementById('minor').value,
          isStudent: document.getElementById('isStudent').checked,
          isInstructor: document.getElementById('isInstructor').checked,
      };

      axios.post(`/api/signup`, data)
          .then(res => {
              if(res && res.data && res.data.success) {
                  console.log(res);
                  const message = "Hello " + res.data.userName + ", welcome to ClassPlus!"
                  alert(message);
                  location.replace('login.html');
              }
          });
  }
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

// This function doesn't allow users to type space bar
function inputConstraint(){
  document.getElementById('firstName').addEventListener('keydown', function(event) {
      if (event.key === ' ' || (event.key >= '0' && event.key <= '9') || !(event.key >= 'a' && event.key <= 'z' || event.key >= 'A' && event.key <= 'Z')) {
          event.preventDefault();
      }
  });
  document.getElementById('lastName').addEventListener('keydown', function(event) {
      if (event.key === ' ' || (event.key >= '0' && event.key <= '9') || !(event.key >= 'a' && event.key <= 'z' || event.key >= 'A' && event.key <= 'Z')) {
          event.preventDefault();
      }
  });
  document.getElementById('userPassword').addEventListener('keydown', function(event) {
      if (event.key === ' ') {
          event.preventDefault();
      }
  });
  document.getElementById('email').addEventListener('keydown', function(event) {
      if (event.key === ' ') {
          event.preventDefault();
      }
  });
}

inputConstraint();
