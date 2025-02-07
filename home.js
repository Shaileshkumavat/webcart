document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const profileBtn = document.getElementById("profileBtn");

    console.log("Login Button:", loginBtn);
    console.log("Profile Button:", profileBtn);

    // Check if user is logged in from localStorage
    if (localStorage.getItem("isLoggedIn") === "true") {
        loginBtn.style.display = "none";  // Hide login button
        profileBtn.style.display = "inline-block"; // Show profile button
    } else {
        loginBtn.style.display = "inline-block";
        profileBtn.style.display = "none";
    }

    // Login functionality
    loginBtn.addEventListener("click", function () {
        localStorage.setItem("isLoggedIn", "true");
        loginBtn.style.display = "none";  // Hide login button
        profileBtn.style.display = "inline-block"; // Show profile button
    });

    // Logout functionality (Click Profile to Logout)
    profileBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        profileBtn.style.display = "none"; // Hide profile button
        loginBtn.style.display = "inline-block"; // Show login button
    });
});
