const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").patch(protect, renameGroup);
router.route("/groupRemove").patch(protect, removeFromGroup);
router.route("/groupAdd").patch(protect, addToGroup)


module.exports = router;