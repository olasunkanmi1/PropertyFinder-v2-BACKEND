import { UnAuthorizededError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
    // if (requestUser.role === 'admin') return; //not needed in this project, no role assigned to users
    if (requestUser.userId === resourceUserId.toString()) return;
    throw new UnAuthorizededError(
      'Not authorized to access this route'
    );
};

export default checkPermissions;  