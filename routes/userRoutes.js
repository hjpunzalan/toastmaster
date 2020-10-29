const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();
if (process.env.NODE_ENV === "test")
	router.post("/register", userController.register);
else
	router.post(
		"/register",
		authController.restrictTo("admin", "committee"),
		userController.register
	);

router.route("/").get(userController.getAllUsers);
router.post("/updatePassword", authController.updatePassword);
router.patch("/updateMe", userController.updateMe);
router.patch("/deleteMe", userController.deleteMe);
router.patch(
	"/deActivateUser/:id",
	authController.restrictTo("admin", "committee"),
	userController.deleteUser
);
router.patch(
	"/activateUser/:id",
	authController.restrictTo("admin", "committee"),
	userController.reActivateUser
);

router.patch(
	"/makeCommittee/:id",
	authController.restrictTo("admin"),
	userController.makeComittee
);
router.patch(
	"/removeCommittee/:id",
	authController.restrictTo("admin"),
	userController.removeCommittee
);

module.exports = router;
