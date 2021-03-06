import tokenGenerator from '../../helpers/signToken';
import userModel from '../../models/userModel';
import { responseSuccess, responseError } from '../../helpers/responseHelpers';
import { verifyPassword } from '../../helpers/passwordHash';


const signIn = async (req, res) => {
  const { body } = req;
  try {
    const user = await userModel.getUserByEmail(body.email);
    if (!user) {
      return responseError(res, 404, 'This user email is not registered');
    }
    const isMatch = verifyPassword(body.password, user.password);
    if (!isMatch) {
      return responseError(res, 401, 'Unauthorized! The password is incorrect.');
    }
    const token = tokenGenerator.signToken(user);
    user.token = token;
    let message = 'User Successfully Logged in';
    if (user.is_admin) {
      message = 'Superuser Logged in Successfully';
    }
    return responseSuccess(res, 200, message, { is_admin: user.is_admin, token: user.token });
  } catch (err) {
    return responseError(res, 400, err);
  }
};

module.exports = {
  signIn,
};
