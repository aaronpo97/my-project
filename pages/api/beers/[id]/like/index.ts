import validateRequest from '@/config/nextConnect/middleware/validateRequest';
import APIResponseValidationSchema from '@/validation/APIResponseValidationSchema';
import getBeerPostById from '@/services/BeerPost/getBeerPostById';
import { UserExtendedNextApiRequest } from '@/config/auth/types';
import { createRouter } from 'next-connect';
import { z } from 'zod';
import { NextApiResponse } from 'next';
import ServerError from '@/config/util/ServerError';
import createBeerPostLike from '@/services/BeerPostLike/createBeerPostLike';
import removeBeerPostLikeById from '@/services/BeerPostLike/removeBeerPostLikeById';
import findBeerPostLikeById from '@/services/BeerPostLike/findBeerPostLikeById';
import getCurrentUser from '@/config/nextConnect/middleware/getCurrentUser';
import NextConnectOptions from '@/config/nextConnect/NextConnectOptions';

const sendLikeRequest = async (
  req: UserExtendedNextApiRequest,
  res: NextApiResponse<z.infer<typeof APIResponseValidationSchema>>,
) => {
  const user = req.user!;
  const id = req.query.id as string;

  const beer = await getBeerPostById(id);
  if (!beer) {
    throw new ServerError('Could not find a beer post with that id', 404);
  }

  const alreadyLiked = await findBeerPostLikeById(beer.id, user.id);

  const jsonResponse = {
    success: true as const,
    message: '',
    statusCode: 200 as const,
  };

  if (alreadyLiked) {
    await removeBeerPostLikeById(alreadyLiked.id);
    jsonResponse.message = 'Successfully unliked beer post';
  } else {
    await createBeerPostLike({ id, user });
    jsonResponse.message = 'Successfully liked beer post';
  }

  res.status(200).json(jsonResponse);
};

const router = createRouter<
  UserExtendedNextApiRequest,
  NextApiResponse<z.infer<typeof APIResponseValidationSchema>>
>();

router.post(
  getCurrentUser,
  validateRequest({ querySchema: z.object({ id: z.string().uuid() }) }),
  sendLikeRequest,
);

const handler = router.handler(NextConnectOptions);
export default handler;
