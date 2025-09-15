const mysql = require("mysql2");
const db = require("../db/db");

const applyToMission = async (id_user, id_mission) => {
    try {
        console.log("applying to mission in dao");
        const [results] = await db.execute("INSERT INTO applications (id_user, id_mission) VALUES (?, ?)", [id_user, id_mission]);
        return ({ valid: true, value: results });
    } catch (error) {
        console.log("error applyToMission");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}

const getApplicationsByUserId = async (id_user) => {
    try {
        console.log("getting applications by user id in dao");
        const [results] = await db.execute("SELECT a.id, a.name, a.creation, a.description, a.duration, b.date, b.state FROM missions a JOIN applications b ON a.id = b.id_mission WHERE b.id_user = ? ", [id_user]);
        return ({ valid: true, value: results });
    } catch (error) {
        console.log("error getApplicationsByUserId");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}

const getApplicationsByMissionId = async (id_mission) => {
    try {
        console.log("getting applications by mission id in dao");
        const [results] = await db.execute("SELECT a.id, a.name, a.email, a.description, b.date, b.state FROM users a JOIN applications b ON a.id = b.id_user WHERE b.id_mission = ? ", [id_mission]);
        return ({ valid: true, value: results });
    } catch (error) {
        console.log("error getApplicationsByMissionId");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}

const acceptApplication = async (id_user, id_mission) => {
    try {
        console.log("accepting application in dao");
        const [resultsA] = await db.execute("UPDATE applications SET state = 'accepted' WHERE id_user = ? AND id_mission = ?", [id_user, id_mission]);
        return ({ valid: true, value: resultsA });
    } catch (error) {
        console.log("error acceptApplication");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }   
}

const closeMission = async (id_mission) => {
    try {
        console.log("closing mission in dao");
        const [results] = await db.execute("UPDATE missions SET status = 'closed' WHERE id = ?", [id_mission]);
        return ({ valid: true, value: results });
    } catch (error) {
        console.log("error closeMission");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}

const refuseApplication = async (id_mission) => {
    try {
        console.log("refusing application in dao");
        const [resultsR] = await db.execute("UPDATE applications SET state = 'rejected' WHERE id_mission = ? AND state = 'pending'", [id_mission]);
        return ({ valid: true, value: resultsR });
    } catch (error) {
        console.log("error refuseApplication");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}

module.exports = { applyToMission, getApplicationsByUserId, getApplicationsByMissionId, acceptApplication, refuseApplication, closeMission};