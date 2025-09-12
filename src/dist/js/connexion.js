document.getElementById("connexion").addEventListener("click", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Veuillez remplir les informations demandé.");
        window.location.reload();
        return;
    } else {
        try {
            const response = fetch("/api/connexion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            }).then(res => res.json()).then(data => {
                if (data.token) {
                    console.log("Connexion réussie:", data);
                    localStorage.setItem("token", data.token);
                    window.location.href = "/index.html";
                } else {
                    console.error("Erreur de connexion:", data);
                    alert(data.message);
                    window.location.reload();
                }
            });
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("Une erreur est survenue. Veuillez réessayer plus tard.");
            window.location.reload();
            return;
        }
    }
});