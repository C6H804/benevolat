const express = require("express");
const joi = require("joi");

const schema = joi.object({
    name: joi.string().min(3).max(255).required(),
    description: joi.string().max(5000).optional(),
    duration: joi.number().min(1).max(8760).integer().required()
});



const router = express.Router();
const auth = require("../middleware/auth");
const getMissions = require("../dao/missions.dao").getMissions;
const getMissionById = require("../dao/missions.dao").getMissionById;
const getUserByEmail = require("../dao/users.dao").getUserByEmail;
const createMission = require("../dao/missions.dao").createMission;
const getApplicationsByMissionId = require("../dao/applications.dao").getApplicationsByMissionId;
const getMissionByAssociationId = require("../dao/missions.dao").getMissionByAssociationId;

const acceptApplication = require("../dao/applications.dao").acceptApplication;
const closeMission = require("../dao/applications.dao").closeMission;
const refuseApplication = require("../dao/applications.dao").refuseApplication;


router.use(auth);


router.post("/", async (req, res) => {
    const missions = await getMissions();
    if (missions.valid == false) return res.status(missions.code).json({ message: missions.message });
    return res.status(200).json({ missions: missions.value });

});


router.post("/create", async (req, res) => {
    console.log("creating mission post request received");

    if (req.user.type !== "association") return res.status(403).json({ message: "forbidden" });
    const name = req.body.name;
    const description = req.body.description !== undefined ? req.body.description : null;
    const duration = req.body.duration;
    const validation = schema.validate({ name, description, duration });
    if (validation.error) return res.status(400).json({ message: validation.error.details[0].message });
    // get id by email
    
    const userId = req.user.userId;
    
    
    const mission = await createMission(name, description, duration, userId);
    console.log(mission);
    if (mission.valid == false) return res.status(mission.code).json({ message: mission.message });
    
    return res.status(201).json({ message: "mission created", missionId: mission.value });
});

router.post("/:id", async (req, res) => {
    console.log("getting mission by id");
    const missionId = req.params.id;
    const mission = await getMissionById(missionId);
    if (mission.valid == false) return res.status(mission.code).json({ message: mission.message });
    return res.status(200).json({ mission: mission.value });
});

router.get("/application/:id", async (req, res) => {
    console.log("applications get by id request received");
    if (req.user.type !== "association") return res.status(403).json({ message: "forbidden" });
    const missionId = req.params.id;
    if (missionId === undefined || isNaN(parseInt(missionId)) || missionId % 1 !== 0 || !(missionId >= 0)) return res.status(400).json({ message: "invalid mission id" });

    // find the mission in the database
    const mission = await getMissionById(missionId);
    if (!mission.valid) return res.status(mission.code).json({ message: mission.message });
    if (mission.value.id_association !== req.user.userId) return res.status(403).json({ message: "forbidden" });

    const applications = await getApplicationsByMissionId(missionId);
    if (!applications.valid) return res.status(applications.code).json({ message: applications.message });
    return res.status(200).json({ message: "applications retrieved", value: applications.value });
});


router.post("/application/accept/:id", async (req, res) => {
    console.log("applications post by id request received");
    if (req.user.type !== "association") return res.status(403).json({ message: "forbidden" });
    const missionId = req.params.id;
    const userId = req.body.userId;
    if (missionId === undefined || isNaN(parseInt(missionId)) || missionId % 1 !== 0 || !(missionId >= 0)) return res.status(400).json({ message: "invalid mission id" });
    if (userId === undefined || isNaN(parseInt(userId)) || userId % 1 !== 0 || !(userId >= 0)) return res.status(400).json({ message: "invalid user id" });

    console.log("missionId:", missionId, "userId:", userId);

    // find the mission in the database
    const mission = await getMissionById(missionId);
    if (!mission.valid) return res.status(mission.code).json({ message: mission.message });
    if (mission.value.id_association !== req.user.userId) return res.status(403).json({ message: "forbidden" });

    const application = await acceptApplication(userId, missionId);
    if (!application.valid) return res.status(application.code).json({ message: application.message });
    const refusedApplications = await refuseApplication(missionId);
    if (!refusedApplications.valid) return res.status(refusedApplications.code).json({ message: refusedApplications.message });
    
    const closedMission = await closeMission(missionId);
    if (!closedMission.valid) return res.status(closedMission.code).json({ message: closedMission.message });
    return res.status(200).json({ message: "application accepted and mission closed" });
});

router.post("/list", async (req, res) => {
    if (req.user.type !== "association") return res.status(403).json({ message: "forbidden" });
    const associationId = req.user.userId;
    
    const missions = await getMissionByAssociationId(associationId);
    if (missions.valid == false) return res.status(missions.code).json({ message: missions.message });

    let result = [];

    for (const m of missions.value) {
        const app = await getApplicationsByMissionId(m.id);
        const obj = {
            id: m.id,
            name: m.name,
            creation: m.creation,
            description: m.description,
            duration: m.duration,
            status: m.status,
            applications: app.valid ? app.value : 0
        };
        result.push(obj);
    }

    return res.status(200).json({ missions: result });
});



module.exports = router;