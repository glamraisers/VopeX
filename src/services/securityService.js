import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const SECRET_KEY = process.env.JWT_SECRET;

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY
}, (jwtPayload, done) => {
  // Verify the token and return the user
  return done(null, jwtPayload);
}));

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
