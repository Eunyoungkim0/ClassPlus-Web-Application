
    // Load content from "navbar.html" into the "nav-placeholder" div
$.get("navbar.html", function(data){
    $("#nav-placeholder").replaceWith(data);
});
