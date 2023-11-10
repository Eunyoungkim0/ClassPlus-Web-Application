$.get("navbar.html", function(data){
    $("#nav-placeholder").replaceWith(data);
});

$.get("searchbar.html", function(data){
    $("#search-placeholder").replaceWith(data);
});

$.get("course_top.html", function(data){
    $("#courseTop-placeholder").replaceWith(data);
});

$.get("searchbar.html", function(data){
    $("#searchbar-placeholder").replaceWith(data);
});

$.get("course_nav.html", function(data){
    $("#courseNav-placeholder").replaceWith(data);
});

$.get("profile_nav.html", function(data){
    $("#profileNav-placeholder").replaceWith(data);
});

$.get("study_group_nav.html", function(data){
    $("#studyGroupNav-placeholder").replaceWith(data);
});

$.get("mycourse_top.html", function(data){
    $("#mycourseTop-placeholder").replaceWith(data);
});

$.get("mygroup_top.html", function(data){
    $("#mygroupTop-placeholder").replaceWith(data);
});

$.get("group_top.html", function(data){
    $("#groupTop-placeholder").replaceWith(data);
});

$.get("study_group_nav.html", function(data){
    $("#groupNav-placeholder").replaceWith(data);
});



function navigateToCoursePage() {
    window.location.href = 'mycourse.html';
}

function navigateToSearch() {
    window.location.href = 'course_search.html';
}

function navigateToSearchGroup() {
    window.location.href = 'group_search.html';
}