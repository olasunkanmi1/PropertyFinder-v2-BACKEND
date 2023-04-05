const createTokenUser = (user) => {
  return { firstName: user.firstName, lastName: user.lastName, email: user.email, userId: user._id, isVerified: user.isVerified, verificationToken: user.verificationToken, photoUrl: user.photoUrl };
};

export default createTokenUser;
