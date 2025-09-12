// module.exportsconst auth = async () => {
export async function auth() {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) notLogged();

    const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" , "Authorization": "Bearer " + token }
    });
    const data = await response.json();
    if (data.valid) {
        console.log("User is authenticated");
        return data.user;
    } else {
        notLogged();
    }
}



const notLogged = () => {
    alert("Vous devez être connecté.");
    window.location.href = "/connexion.html";
}
