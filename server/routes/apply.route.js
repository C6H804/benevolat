const express = require("express");

const router = express.Router();

const getMissionById = require("../dao/missions.dao").getMissionById;
const applyToMission = require("../dao/applications").applyToMission;
const getUserByEmail = require("../dao/users.dao").getUserByEmail;
const getApplicationsByUserId = require("../dao/applications").getApplicationsByUserId;

const auth = require("../middleware/auth");
router.use(auth);


router.post("/:id", async (req, res) => {
    console.log("applying to mission post request received");
    if (req.user.type !== "volunteer") return res.status(403).json({ message: "forbidden" });
    const missionId = req.params.id;
    if (missionId === undefined || isNaN(parseInt(missionId)) || missionId % 1 !== 0 || !(missionId >= 0)) return res.status(400).json({ message: "invalid mission id" });

    // find the mission in the database
    const mission = await getMissionById(missionId);
    if (!mission.valid) return res.status(mission.code).json({ message: mission.message });

    if (mission.value.status !== "pending") return res.status(400).json({ message: "you can only apply to pending missions" });

    // get ID from the token
    const userEmail = req.user.email;
    console.log("user email from token:", userEmail);

    userId = req.user.userId;

    const application = await applyToMission(userId, missionId);
    if (!application.valid) return res.status(application.code).json({ message: application.message });
    return res.status(201).json({ message: "application created" });
});

router.post("/", async (req, res) => {
    console.log("applications get request received");
    if (req.user.type !== "volunteer") return res.status(403).json({ message: "forbidden" });
    const userId = req.user.userId;
    const applications = await getApplicationsByUserId(userId);
    if (!applications.valid) return res.status(applications.code).json({ message: applications.message });
    return res.status(200).json({ message: "applications retrieved", value: applications.value });
});



module.exports = router;