"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.get('/', userController.getUsers.bind(userController));
router.get('/all', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.post('/', userController.createUser.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.put('/:id/reset-password', userController.resetPassword.bind(userController));
router.put('/:id/permissions', userController.updateUserPermissions.bind(userController));
router.put('/:id/toggle-status', userController.toggleUserStatus.bind(userController));
router.get('/check-username/:username', userController.checkUsernameExists.bind(userController));
router.get('/check-email/:email', userController.checkEmailExists.bind(userController));
exports.default = router;
//# sourceMappingURL=users.js.map