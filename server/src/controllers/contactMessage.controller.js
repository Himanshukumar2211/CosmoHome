import {
  createContactMessageService,
  deleteContactMessageService,
  listContactMessagesService,
  updateContactMessageService,
} from '../services/contactMessage.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await createContactMessageService(req.body);

  res.status(201).json(new ApiResponse(201, { contactMessage }, 'Contact message saved'));
});

export const listContactMessages = asyncHandler(async (req, res) => {
  const result = await listContactMessagesService(req.query);

  res.status(200).json(new ApiResponse(200, result, 'Contact messages fetched'));
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await updateContactMessageService(req.params.id, req.body);

  res.status(200).json(new ApiResponse(200, { contactMessage }, 'Contact message updated'));
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  await deleteContactMessageService(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Contact message deleted'));
});
