function fetchAndInjectContent(url, targetId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(targetId).innerHTML = html;
        })
        .catch(error => console.error(`Error fetching ${url}:`, error));
}

document.addEventListener("DOMContentLoaded", function () {
    fetchAndInjectContent("navbar.html", "navigation");
    fetchAndInjectContent("package.html", "package");
    fetchAndInjectContent("blog.html", "blog");
    fetchAndInjectContent("contact.html", "contact");
    fetchAndInjectContent("about.html", "about");
    fetchAndInjectContent("footer.html", "footer");
    
    
});