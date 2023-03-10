import Layout from '@/components/ui/Layout';
import { BeerPostQueryResult } from '@/services/BeerPost/schema/BeerPostQueryResult';
import getBreweryPostById from '@/services/BreweryPost/getBreweryPostById';
import { GetServerSideProps, NextPage } from 'next';

interface BreweryPageProps {
  breweryPost: BeerPostQueryResult;
}

const BreweryByIdPage: NextPage<BreweryPageProps> = ({ breweryPost }) => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold underline">{breweryPost.name}</h1>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<BreweryPageProps> = async (
  context,
) => {
  const breweryPost = await getBreweryPostById(context.params!.id! as string);
  return !breweryPost
    ? { notFound: true }
    : { props: { breweryPost: JSON.parse(JSON.stringify(breweryPost)) } };
};

export default BreweryByIdPage;
