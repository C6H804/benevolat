import { auth } from "./components/auth.js";
import { loadDashboardAsso } from "./asso/dashboard.js";


const init = async () => {
    const user = await auth();
    console.log("Authenticated user:", user);
    if (user.type === "association") {
        loadDashboardAsso(user);
    } else if (user.type === "volunteer") {

    } else {
        localStorage.removeItem("token");
        alert("Vous n'êtes pas autorisé à accéder à cette page.");
        window.location.href = "/connexion.html";
    }
}

init();