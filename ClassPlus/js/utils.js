$.get("navbar.html", function(data){
    $("#nav-placeholder").replaceWith(data);
});

$.get("searchbar.html", function(data){
    $("#search-placeholder").replaceWith(data);
});

$.get("course_top.html", function(data){
    $("#courseTop-placeholder").replaceWith(data);
});

function navigateToCoursePage() {
    window.location.href = 'MyCourse.html';
}

function studySetsFunction() {
    window.location.href = 'course_page_study_sets.html';
}
function navigateToPosting() {
    window.location.href = 'course_page_posting.html';
}

function navigateToEnroll() {
  window.location.href = 'course_page_searchpage.html';
}