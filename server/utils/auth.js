import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

dotenv.config();

// set token secret and expiration date
const secret = process.env.JWT_SECRET;
const expiration = '15m';

export default {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const payload = jwt.verify(token, secret, { maxAge: expiration });
      req.user = payload;
      return req;
    } catch (err) {
      throw new GraphQLError('Invalid token');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign(payload, secret, { expiresIn: expiration });
  },
};