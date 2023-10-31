$.get("navbar.html", function(data){
    $("#nav-placeholder").replaceWith(data);
});

$.get("searchbar.html", function(data){
    $("#search-placeholder").replaceWith(data);
});