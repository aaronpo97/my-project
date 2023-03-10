import sendCreateBeerPostRequest from '@/requests/sendCreateBeerPostRequest';
import CreateBeerPostValidationSchema from '@/services/BeerPost/schema/CreateBeerPostValidationSchema';
import BreweryPostQueryResult from '@/services/BreweryPost/types/BreweryPostQueryResult';
import { zodResolver } from '@hookform/resolvers/zod';
import { BeerType } from '@prisma/client';
import router from 'next/router';
import { FunctionComponent, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import ErrorAlert from './ui/alerts/ErrorAlert';
import Button from './ui/forms/Button';
import FormError from './ui/forms/FormError';
import FormInfo from './ui/forms/FormInfo';
import FormLabel from './ui/forms/FormLabel';
import FormSegment from './ui/forms/FormSegment';
import FormSelect from './ui/forms/FormSelect';
import FormTextArea from './ui/forms/FormTextArea';
import FormTextInput from './ui/forms/FormTextInput';

type CreateBeerPostSchema = z.infer<typeof CreateBeerPostValidationSchema>;

interface BeerFormProps {
  breweries: BreweryPostQueryResult[];
  types: BeerType[];
}

const CreateBeerPostForm: FunctionComponent<BeerFormProps> = ({
  breweries = [],
  types = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBeerPostSchema>({
    resolver: zodResolver(CreateBeerPostValidationSchema),
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<CreateBeerPostSchema> = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await sendCreateBeerPostRequest(data);
      router.push(`/beers/${response.id}`);
    } catch (e) {
      if (!(e instanceof Error)) {
        setError('Something went wrong');
        return;
      }
      setError(e.message);
    }
  };

  return (
    <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
      <div>{error && <ErrorAlert error={error} setError={setError} />}</div>
      <FormInfo>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormError>{errors.name?.message}</FormError>
      </FormInfo>
      <FormSegment>
        <FormTextInput
          placeholder="Lorem Ipsum Lager"
          formValidationSchema={register('name')}
          error={!!errors.name}
          type="text"
          id="name"
          disabled={isSubmitting}
        />
      </FormSegment>

      <div className="flex flex-wrap">
        <div className="mb-2 w-full md:mb-0 md:w-1/2 md:pr-3">
          <FormInfo>
            <FormLabel htmlFor="breweryId">Brewery</FormLabel>
            <FormError>{errors.breweryId?.message}</FormError>
          </FormInfo>
          <FormSegment>
            <FormSelect
              disabled={isSubmitting}
              formRegister={register('breweryId')}
              error={!!errors.breweryId}
              id="breweryId"
              options={breweries.map((brewery) => ({
                value: brewery.id,
                text: brewery.name,
              }))}
              placeholder="Brewery"
              message="Pick a brewery"
            />
          </FormSegment>
        </div>
        <div className="mb-2 w-full md:mb-0 md:w-1/2 md:pl-3">
          <FormInfo>
            <FormLabel htmlFor="typeId">Type</FormLabel>
            <FormError>{errors.typeId?.message}</FormError>
          </FormInfo>
          <FormSegment>
            <FormSelect
              disabled={isSubmitting}
              formRegister={register('typeId')}
              error={!!errors.typeId}
              id="typeId"
              options={types.map((beerType) => ({
                value: beerType.id,
                text: beerType.name,
              }))}
              placeholder="Beer type"
              message="Pick a beer type"
            />
          </FormSegment>
        </div>
      </div>

      <div className="flex flex-wrap md:mb-3">
        <div className="mb-2 w-full md:mb-0 md:w-1/2 md:pr-3">
          <FormInfo>
            <FormLabel htmlFor="abv">ABV</FormLabel>
            <FormError>{errors.abv?.message}</FormError>
          </FormInfo>
          <FormTextInput
            disabled={isSubmitting}
            placeholder="12"
            formValidationSchema={register('abv', { valueAsNumber: true })}
            error={!!errors.abv}
            type="text"
            id="abv"
          />
        </div>
        <div className="mb-2 w-full md:mb-0 md:w-1/2 md:pl-3">
          <FormInfo>
            <FormLabel htmlFor="ibu">IBU</FormLabel>
            <FormError>{errors.ibu?.message}</FormError>
          </FormInfo>
          <FormTextInput
            disabled={isSubmitting}
            placeholder="52"
            formValidationSchema={register('ibu', { valueAsNumber: true })}
            error={!!errors.ibu}
            type="text"
            id="lastName"
          />
        </div>
      </div>

      <FormInfo>
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormError>{errors.description?.message}</FormError>
      </FormInfo>
      <FormSegment>
        <FormTextArea
          disabled={isSubmitting}
          placeholder="Ratione cumque quas quia aut impedit ea culpa facere. Ut in sit et quas reiciendis itaque."
          error={!!errors.description}
          formValidationSchema={register('description')}
          id="description"
          rows={8}
        />
      </FormSegment>

      <div className="mt-6">
        <Button type="submit" isSubmitting={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default CreateBeerPostForm;
