const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { sendMessage, replyMessage, getMyInbox, getMyConversations, getConversation } = require("../controllers/inbox.controller");

router.get("/my", authenticateToken, getMyInbox);
router.get("/bought", authenticateToken, getMyConversations);
router.get("/conversation/:vehicleId/:buyerId", authenticateToken, getConversation);
router.post("/:vehicleId/message", authenticateToken, sendMessage);
router.post("/:vehicleId/reply", authenticateToken, replyMessage);

module.exports = router;
