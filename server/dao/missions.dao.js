const mysql = require("mysql2");
const db = require("../db/db");

const getMissions = async () => {
    try {
        const [results] = await db.execute("SELECT a.id, a.name, a.creation, a.description, a.duration, b.name AS associations FROM missions a JOIN users b ON a.id_association = b.id WHERE a.status = 'pending' ORDER BY a.creation DESC");
        return ({ valid: true, value: results });
    } catch (error) {
        console.log("error getMissions");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}

const getMissionById = async (id) => {
    try {
        const [results] = await db.execute("SELECT a.id, a.name, a.creation, a.description, a.duration, a.status, b.name AS associations, id_association FROM missions a JOIN users b ON a.id_association = b.id WHERE a.id = ? LIMIT 1", [id]);
        if (results.length === 0) return ({ valid: false, message: "mission not found", code: 404 });
        return ({ valid: true, value: results[0] });
    } catch (error) {
        console.log("error getMissionById");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}

const getMissionByAssociationId = async (id_association) => {
    try {
        const [results] = await db.execute("SELECT a.id, a.name, a.creation, a.description, a.duration, a.status, a.id_association, b.name AS associations FROM missions a JOIN users b ON a.id_association = b.id WHERE a.id_association = ? ORDER BY a.creation DESC LIMIT 50", [id_association]);
        return ({ valid: true, value: results });
    } catch (error) {
        console.log("error getMissionByAssociationId");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}


const createMission = async (name, description, duration, id_association) => {
    try {
        const [results] = await db.execute("INSERT INTO missions (name, description, duration, id_association) VALUES (?, ?, ?, ?)",[name, description, duration, id_association]);
        return ({ valid: true, value: results });
    } catch (error) {
        console.log("error createMission");
        console.error(error);
        return ({ valid: false, message: "database error", code: 500 });
    }
}


module.exports = { getMissions, getMissionById, createMission, getMissionByAssociationId };