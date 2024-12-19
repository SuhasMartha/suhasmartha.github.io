var typed = new Typed((".skills"),{
    strings : ["Data Scientist","AI & Data Engineer","Student"],
    typeSpeed : 100,
    backSpeed : 100,
    backDelay : 1000,
    loop : true
});

var sections = document.querySelectorAll("section");
var links = document.querySelectorAll("header nav a");
var menu = document.querySelector("#menu");
var navbar = document.querySelector("header nav");

menu.onclick = () => {
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("active");
};

window.onscroll = () => {
    sections.forEach(sec => {
        var scroll = scrollY;
        var offset = sec.offsetTop - 100;
        var id = sec.id;

        if(scroll >= offset){
            links.forEach(e => {
                e.classList.remove("active");
            });
            document.querySelector('nav a[href="#' + id + '"]').classList.add("active");
        };
    });
    menu.classList.remove("bx-x");
    navbar.classList.remove("active");
};