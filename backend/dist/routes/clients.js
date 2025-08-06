"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClientController_1 = require("../controllers/ClientController");
const router = (0, express_1.Router)();
router.get('/', ClientController_1.ClientController.getClients);
router.get('/:id', ClientController_1.ClientController.getClientById);
router.post('/', ClientController_1.ClientController.createClient);
router.put('/:id', ClientController_1.ClientController.updateClient);
router.delete('/:id', ClientController_1.ClientController.deleteClient);
router.post('/:clientId/files', ClientController_1.ClientController.addClientFile);
router.delete('/:clientId/files', ClientController_1.ClientController.removeClientFile);
exports.default = router;
//# sourceMappingURL=clients.js.map