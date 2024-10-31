import ApiError from "../utils/ApiError.js";

export const roleRestriction = (...roles) => {
    return (req, _, next) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            next(new ApiError(403, 'You don\'t have permission to access this action'));
        }
    };
}

