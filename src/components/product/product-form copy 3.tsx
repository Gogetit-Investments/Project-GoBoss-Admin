import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  ChangeEventHandler,
} from 'react';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';

import SelectInput from '@/components/ui/select-input';
import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import { productValidationSchema } from './product-validation-schema';
import ProductVariableForm from './product-variable-form';
import ProductSimpleForm from './product-simple-form';
import ProductGroupInput from './product-group-input';
import ProductCategoryInput from './product-category-input';
import ProductTypeInput from './product-type-input';
import { ProductType, Product } from '@/types';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop';
import ProductTagInput from './product-tag-input';
import { Config } from '@/config';
import Alert from '@/components/ui/alert';
import ProductAuthorInput from './product-author-input';
import ProductManufacturerInput from './product-manufacturer-input';
import { EditIcon } from '@/components/icons/edit';
import {
  getProductDefaultValues,
  getProductInputValues,
  ProductFormValues,
} from './form-utils';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/data/product';
import { split, join, forIn } from 'lodash';
import { useCategoriesQuery } from '@/data/category';
import { Control, useFormState, useWatch } from 'react-hook-form';
import React from 'react';
import ImageUploader from 'react-images-upload';
import './reactImagesUpload.module.css';
import 'react-toastify/dist/ReactToastify.css';

const MyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { locale } = useRouter();
  const { categories, loading } = useCategoriesQuery({
    limit: 999,
    language: locale,
  });

  const router = useRouter();
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    }
  );

  const shopId = shopData?.id!;
  const [formData, setFormData] = useState<{
    shop_id: string;
    type_id: number;
    product_type: 'simple';
    unit: string;
    name: string;
    price: string;
    description: string;
    quanity: string;
    sale_price: string;
    quantity: string;
    image?: string;
  }>({
    shop_id: shopId,
    type_id: 1,
    product_type: 'simple',
    unit: '',
    name: '',
    price: '',
    description: '',
    quanity: '',
    sale_price: '',
    quantity: '',
    image: {},
  });

  const toBase64 = async (file: File) =>
    new Promise(
      (resolve: (value: string | ArrayBuffer | null) => void, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      }
    );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authCredCookie = cookies.get('AUTH_CRED');
      if (!authCredCookie) {
        console.error('Cookie not found');
        return;
      }

      const authCred = JSON.parse(authCredCookie);
      const token = authCred.token;
      const permissions = authCred.permissions;

      if (!token) {
        console.error('Token not found in cookie');
        return;
      }

      const response = await fetch(
        `http://localhost:8001/api/upload_image`,
        // `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Permissions: permissions.join(','),
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success('Product added successfully');
        setFormData({
          ...formData,
          name: '',
          description: '',
          unit: '',
          price: '',
          quantity: '',
          sale_price: '',
          image: {},
        });
      } else {
        toast.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [uploadedImages, setUploadedImages] = useState([]);
  const uploaderProps = {
    name: 'image',
    withPreview: true,
    withIcon: false,
    buttonText: 'Select image',
    singleImage: true,
    onChange: async (files: File[], pictures: string[]) => {
      const file = files.at(0);
      // no file was selected
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: reader.result?.toString(),
        }));
    },
    imgExtension: ['.jpg', '.gif', '.png', '.gif', 'jpeg'],
    maxFileSize: 5242880,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={t('form:product-description-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={`${t('form:input-label-product-name')}*`}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label={t('form:input-label-description')}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={`${t('form:input-label-unit')}*`}
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-simple-product-info')}
          details={t('form:form-description-simple-product-info')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-sale-price')}
            type="number"
            id="sale_price"
            name="sale_price"
            value={formData.sale_price}
            onChange={handleChange}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={`${t('form:input-label-price')}*`}
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            variant="outline"
            className="mb-5"
          />

          <Input
            label={`${t('form:input-label-quantity')}*`}
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:featured-image-title')}
          details={t('form:featured-image-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <div>
          <Label>Upload Cover Image</Label>
          <ImageUploader {...uploaderProps} />
        </div>
      </div>

      <div className="mb-4 text-end">
        <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>

        <Button disabled={isSubmitting}>
          {isSubmitting
            ? t('form:button-label-submitting')
            : t('form:button-label-add-product')}
        </Button>
      </div>
    </form>
  );
};

export default MyForm;
