import APIResponseValidationSchema from '@/validation/APIResponseValidationSchema';
import NextConnectConfig from '@/config/nextConnect/NextConnectConfig';
import passport from 'passport';
import nextConnect from 'next-connect';
import localStrat from '@/config/auth/localStrat';
import { setLoginSession } from '@/config/auth/session';
import { NextApiResponse } from 'next';
import { z } from 'zod';
import ServerError from '@/config/util/ServerError';
import { ExtendedNextApiRequest } from '../../../config/auth/types';

const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default nextConnect<
  ExtendedNextApiRequest,
  NextApiResponse<z.infer<typeof APIResponseValidationSchema>>
>(NextConnectConfig)
  .use(passport.initialize())
  .use(async (req, res, next) => {
    passport.use(localStrat);
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ServerError('Username and password are required.', 400);
    }

    passport.authenticate('local', { session: false }, (error, token) => {
      if (error) {
        next(error);
      } else {
        req.user = token;
        next();
      }
    })(req, res, next);
  })
  .post(async (req, res) => {
    const user = req.user!;
    await setLoginSession(res, user);

    res.status(200).json({
      message: 'Login successful.',
      statusCode: 200,
      success: true,
    });
  });