import { z } from 'zod';

export const beerPostQueryResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  brewery: z.object({
    id: z.string(),
    name: z.string(),
  }),
  description: z.string(),
  beerImages: z.array(
    z.object({
      path: z.string(),
      caption: z.string(),
      id: z.string(),
      alt: z.string(),
    }),
  ),
  ibu: z.number(),
  abv: z.number(),
  type: z.object({
    id: z.string(),
    name: z.string(),
  }),
  postedBy: z.object({
    id: z.string(),
    username: z.string(),
  }),
  createdAt: z.coerce.date(),
});

export const beerPostQueryResultArraySchema = z.array(beerPostQueryResultSchema);

export type BeerPostQueryResult = z.infer<typeof beerPostQueryResultSchema>;

export type BeerPostQueryResultArray = z.infer<typeof beerPostQueryResultArraySchema>;
