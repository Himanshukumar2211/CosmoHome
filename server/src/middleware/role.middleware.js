import { ApiError } from '../utils/ApiError.js';

export const authorizeRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.admin?.role)) {
      throw new ApiError(403, 'Forbidden');
    }

    next();
  };
