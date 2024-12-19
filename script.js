window.onload = function() {
    // Menu logic
    const menu = document.querySelector("#menu");
    const navbar = document.querySelector("header nav");
    const links = document.querySelectorAll("header nav a");
    const sections = document.querySelectorAll("section");

    menu.onclick = () => {
        menu.classList.toggle("bx-x");
        navbar.classList.toggle("active");
    };

    window.onscroll = () => {
        sections.forEach(sec => {
            const scroll = window.scrollY;
            const offset = sec.offsetTop - 100;
            const id = sec.id;

            if (scroll >= offset) {
                links.forEach(e => e.classList.remove("active"));
                const activeLink = document.querySelector(`nav a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add("active");
            }
        });
        menu.classList.remove("bx-x");
        navbar.classList.remove("active");
    };

    // Typed.js animation
    const typed = new Typed(".skills", {
        strings: ["Data Scientist", "AI & Data Engineer", "Student"],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });
};


function sendMail(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    // Collect form data
    let params = {
        first_name: document.getElementById("first-name").value,
        last_name: document.getElementById("last-name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        message: document.getElementById("message").value
    };

    // Send the email using EmailJS
    emailjs.send("your_service_id", "your_template_id", params)
        .then(function(response) {
            alert("Email Sent Successfully!");
            document.querySelector(".form").reset(); // Clear the form after submission
        })
        .catch(function(error) {
            alert("There was an error sending your message. Please try again.");
            console.error("Error:", error);
        });
}