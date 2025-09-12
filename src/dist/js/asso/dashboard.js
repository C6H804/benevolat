import { CreateElement } from "../components/_CreateElement.js";

export async function loadDashboardAsso(user) {
    const addMissionBtn = CreateElement("button", { id: "addMissionBtn", className: "btn btn-add btnAddMission asso" }, ["Ajouter une nouvelle mission"]);
    document.querySelectorAll(".buttonSlot")[0].appendChild(addMissionBtn);

    addMissionBtn.addEventListener("click", () => {
        console.log("TODO ajouter une mission via route API/missions/create");
    });

    const missions = await getMissions(user);
    if (!missions.valid) errorHandler(missions.message);

    console.log("Missions data:", missions);
    const DOMMissions = loadMissions(missions.value.missions);
    document.getElementById("dashboard").appendChild(DOMMissions);
}

const getMissions = async (user) => {
    try {
        const response = await fetch("/api/missions/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }, body: JSON.stringify({ assoId: user.id })
        });
        if (!response.ok) {
            console.error("Failed to fetch missions:", response.statusText);
            return { valid: false, message: "Failed to fetch missions", code: response.status };
        } else {
            const data = await response.json();
            return { valid: true, value: data };
        }
    } catch (error) {
        console.error("Error fetching missions:", error);
        return { valid: false, message: "Failed to fetch missions", code: 500 };
    }
}

function errorHandler(message) {
    alert(message);
    window.location.reload();
}

function loadMissions(missions) {
    const missionsContainer = CreateElement("div", { id: "missionsContainer", className: "missionsContainer container asso" });

    if (Array.isArray(missions)) {
        missions.forEach(mission => {
            const missionCard = CreateElement("div", { className: "missionCard card status-" + mission.status }, [
                CreateElement("h3", { className: "missionTitle" }, [mission.title]),
                CreateElement("h4", { className: "missionDescription" }, [mission.description]),
                CreateElement("p", { className: "date creationDate" }, ["Créée le : " + new Date(mission.creation).toLocaleString().replace(" ", " à ")]),
                CreateElement("p", { className: "duration" }, ["Durée : " + mission.duration + " heures"]),
                CreateElement("p", { className: "status " + mission.status }, ["Statut : " + mission.status]),
                loadApplications(mission.applications, mission.id)
            ]);
            missionCard.addEventListener("click", () => {
                document.getElementById("applicationsContainer" + mission.id).classList.toggle("hidden");
            });
            missionsContainer.appendChild(missionCard);
        });
    } else {
        missionsContainer.appendChild(
            CreateElement("p", { className: "noMissions" }, ["Aucune mission trouvée."])
        );
    }
    return missionsContainer;
}

function loadApplications(applications, id) {
    const applicationsContainer = CreateElement("div", { id: "applicationsContainer" + id, className: "applicationsContainer container asso hidden" });

    if (Array.isArray(applications) && applications.length != 0) {
        applications.forEach(app => {
            const appItem = CreateElement("div", { className: "appItem state-" + app.state }, [
                CreateElement("p", { className: "applicantName" }, ["nom : " + app.name]),
                CreateElement("p", { className: "applicantEmail" }, ["email : " + app.email]),
                CreateElement("p", { className: "applicantDescription" }, [app.description]),
                CreateElement("p", { className: "applicationDate" }, ["Candidature envoyée le : " + new Date(app.date).toLocaleString().replace(" ", " à ")]),
                CreateElement("p", { className: "applicationStatus app" + app.state }, ["Statut : " + app.state]),
                CreateElement("button", { className: "btn btn-accept btnAppAccept", onClick: () => { console.log("TODO accepter la candidature via route API/applications/accept"); } }, ["Accepter"]),
            ]);
            applicationsContainer.appendChild(appItem);
        });
    } else {
        const errorText = CreateElement("p", { className: "noApplications" }, ["Aucune candidature."]);
        applicationsContainer.appendChild(errorText);
    }
    return applicationsContainer;
}