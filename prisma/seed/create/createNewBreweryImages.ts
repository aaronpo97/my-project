// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { BreweryPost, BreweryImage } from '@prisma/client';
import DBClient from '../../DBClient';

interface CreateBreweryImagesArgs {
  numberOfImages: number;
  breweryPosts: BreweryPost[];
}
const createNewBreweryImages = async ({
  numberOfImages,
  breweryPosts,
}: CreateBreweryImagesArgs) => {
  const prisma = DBClient.instance;
  const createdAt = faker.date.past(1);
  const breweryImagesPromises: Promise<BreweryImage>[] = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numberOfImages; i++) {
    const breweryPost = breweryPosts[Math.floor(Math.random() * breweryPosts.length)];

    breweryImagesPromises.push(
      prisma.breweryImage.create({
        data: {
          url: 'https://picsum.photos/900/1600',
          alt: 'Placeholder brewery image.',
          breweryPost: { connect: { id: breweryPost.id } },
          createdAt,
        },
      }),
    );
  }

  return Promise.all(breweryImagesPromises);
};

export default createNewBreweryImages;
