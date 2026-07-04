import { Router } from 'express';
import {
  createContactMessage,
  deleteContactMessage,
  listContactMessages,
  updateContactMessage,
} from '../controllers/contactMessage.controller.js';
import { ROLES } from '../constants/roles.constants.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  contactMessageIdValidator,
  createContactMessageValidator,
  listContactMessagesValidator,
  updateContactMessageValidator,
} from '../validators/contactMessage.validator.js';

const router = Router();
const adminOnly = [authenticateAdmin, authorizeRoles(ROLES.ADMIN)];

router.post('/', createContactMessageValidator, validate, createContactMessage);
router.get('/', adminOnly, listContactMessagesValidator, validate, listContactMessages);
router.patch('/:id', adminOnly, updateContactMessageValidator, validate, updateContactMessage);
router.delete('/:id', adminOnly, contactMessageIdValidator, validate, deleteContactMessage);

export default router;
