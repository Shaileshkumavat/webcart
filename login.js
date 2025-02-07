document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    // Ensure the form element exists before adding an event listener
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Get form field values
            const username_or_email = document.getElementById("username_or_email");
            const password = document.getElementById("password");
            const loginMessage = document.getElementById("loginMessage");

            // Check if required fields exist
            if (!username_or_email || !password) {
                console.error("Login form fields are missing in the DOM.");
                return;
            }

            const data = {
                username_or_email: username_or_email.value,
                password: password.value,
            };

            try {
                const response = await fetch("http://localhost:4900/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                localStorage.clear();
                if (response.ok) {
                    // Store the JWT token in localStorage
                    localStorage.setItem("token", result.token);

                    // Provide success message
                    if (loginMessage) {
                        loginMessage.textContent = "Login successful! Redirecting...";
                        loginMessage.style.color = "green";
                    }

                    // Redirect to home page
                    window.location.href = "index.html";
                } else {
                    // Show error message from the server
                    if (loginMessage) {
                        loginMessage.textContent = result.message || "Invalid login credentials.";
                        loginMessage.style.color = "red";
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                if (loginMessage) {
                    loginMessage.textContent = "Something went wrong. Please try again.";
                    loginMessage.style.color = "red";
                }
            }
        });
    } else {
        console.error("Login form is missing in the DOM.");
    }
});