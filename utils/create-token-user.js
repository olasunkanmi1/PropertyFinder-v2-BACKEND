const createTokenUser = (user) => {
  return { firstName: user.firstName, lastName: user.lastName, email: user.email, userId: user._id };
};

export default createTokenUser;
