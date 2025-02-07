document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signupForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const mobile = document.getElementById("mobile").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirm_password = document.getElementById("confirm_password").value;

        if (password !== confirm_password) {
            if (signupMessage) {
                signupMessage.textContent = 'Passwords do not match!';
                signupMessage.style.color = "red"; // Optional: Add styling
            }
            return;
        }

        const data = {
            name,
            mobile,
            email,
            username,
            password,
            confirm_password,
        };

        try {
            const response = await fetch("http://localhost:4900/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // On success, store the JWT token in localStorage
                localStorage.setItem("token", result.token); // Only works if your backend is returning a token

                // Redirect to the home page
                window.location.href = "index.html";
            } else {
                alert(result.message); // Show the error message from the backend
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});