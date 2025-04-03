import User from "../model/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../config/emailService.js";
import { generateAccessToken } from "../config/generateToken.js";

export const registerUser = async (req, res, next) => {
  const { username, email, fullname, password } = req.body;

  try {
    if (!username || !email || !fullname || !password) {
      return next(createHttpError(400, "All fields are required"));
    }
    //checking if user already exists in db
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);
    if (existingUsername) {
      return next(createHttpError(409, "Username already exists"));
    }
    if (existingEmail) {
      return next(createHttpError(409, "Email already exists"));
    }

    //proceed to register user if user dosen't exists

    const salt = await bcrypt.genSalt(10);

    //encryption mechanism to handle password

    const hashedPassword = await bcrypt.hash(password, salt);

    // password hash

    const user = await User.create({
      username,
      email,
      fullname,
      password: hashedPassword,
    });
    //generate the verification token

    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // specify the verifyAccount link

    const verifyAccountLink = `${process.env.CLIENT_URL}/account/verify-account/${user._id}/${user.verificationToken}`;
    //sending email

    await sendMail({
      fullname: user.fullname,
      intro: ["Welcome to InstaShot", "We're very excited to have you onboard"],
      instructions: `To access our platform, please verify your email using this link ${verifyAccountLink}. Link will expire after 24 hours.`,
      btnText: "Verify",
      subject: "Email verification",
      to: user.email,
    });

    //generate accessToke

    const accessToken = generateAccessToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Acount created successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return next(createHttpError(400, "username or password is missing"));
    }
    //find user - using select to bring back hidden values
    const user = await User.findOne({ username }).select("+password");
    console.log(user);

    if (!user) {
      return next(createHttpError(400, "Account not found"));
    }
    //handle password check
    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    //if all goes well generate token

    const accessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({
      success: true,
      accessToken,
      message: `Welcon ${user.username}`,
    });
  } catch (error) {
    next(error);
  }
};

export const authenticateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const resendEmailVerification = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyAccountLink = `${process.env.CLIENT_URL}/account/verify-account/${user._id}/${user.verificationToken}`;
    //sending email

    await sendMail({
      fullname: user.fullname,
      intro: ["Welcome to InstaShot", "We're very excited to have you onboard"],
      instructions: `To access our platform, please verify your email using this link ${verifyAccountLink}. Link will expire after 24 hours.`,
      btnText: "Verify",
      subject: "Email verification",
      to: user.email,
    });

    res.status(200).json({
      success: true,
      message: "Email verification link sent",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailAccount = async (req, res, next) => {
  const { userId, verificationToken } = req.params;

  try {
    if (!userId || !verificationToken) {
      return next(createHttpError(400, "userId or verification not provided"));
    }

    const user = await User.findOne({ _id: userId, verificationToken }).select(
      "+verificationToken +verificationTokenExpires"
    );
    if (!user) {
      return next(createHttpError(404, "User account not found"));
    }
    if (user.verificationTokenExpires < Date.now()) {
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();

      return next(
        createHttpError(
          401,
          "verification link has expired, please request a new one"
        )
      );
    } else {
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};



export const sendForgotPasswordMail = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return next(createHttpError(400, "Email not provided"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User account not found"));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    const resetPasswordLink = `${process.env.CLIENT_URL}/account/reset-password/${user._id}/${user.passwordResetToken}`;
    //sending email

    await sendMail({
      fullname: user.fullname,
      intro: [
        "You've requested a password reset for your account",
        "if you did not make this request, kindly ignore this email",
      ],
      instructions: `Click here to reset your password: ${resetPasswordLink}. Link will expire after 30 min`,
      btnText: "Reset Password",
      subject: "Password Reset",
      to: user.email,
    });
    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email",
    });
  } catch (error) {}
};



export const resetPassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;
  const { userId, passwordToken } = req.params;
  try {
    if (!newPassword || !confirmPassword) {
      return next(
        createHttpError(400, "New password or confirm password missing")
      );
    }

    const user = await User.findOne({
      _id: userId,
      passwordResetToken: passwordToken,
    }).select("+passwordResetToken +passwordResetTokenExpires");
    if (!user) {
      return next(createHttpError(404, "invalid user id or reset token"));
    }
    if (user.passwordResetTokenExpires < Date.now()) {
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await user.save();

      return next(
        createHttpError(
          401,
          "password link has expired, please request a new one"
        )
      );
    }

    if (newPassword !== confirmPassword) {
      return next(
        createHttpError(400, "New password and confirm password do not match")
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been updated",
    });
  } catch (error) {
    next(error);
  }
};
