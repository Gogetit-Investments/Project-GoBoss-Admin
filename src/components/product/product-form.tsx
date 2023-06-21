import { useState, useEffect } from 'react';
import cookies from 'js-cookie';

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
// import { useState } from 'react';
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
import { split, join } from 'lodash';
import { useCategoriesQuery } from '@/data/category';
import { Control, useFormState, useWatch } from 'react-hook-form';
import React from 'react';
import ImageUploader from 'react-images-upload';
import './reactImagesUpload.module.css';


// const MyForm = () => {

  const MyForm = () => {


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

  const shopId = shopData?.id!
  console.log(shopData?.id)
  const [formData, setFormData] = useState({
    // shop_id: 9,
    shop_id: shopId,
    type_id: 1,
    product_type: 'simple',
    unit: '',
    name: '',
    price: '',
    description: '',
    slug: '',
    quanity: '',
    sale_price:'',
    sku: '',
    quantity: '',
    image: []
  });

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };


  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const authCredCookie = cookies.get('AUTH_CRED'); // Retrieve cookie value
      if (!authCredCookie) {
        // Handle case where cookie is not found
        console.error('Cookie not found');
        return;

        
      }
  
      const authCred = JSON.parse(authCredCookie); // Parse cookie value as JSON
      const token = authCred.token; // Extract the token property
      const permissions = authCred.permissions; // Extract the permissions property
  
      if (!token) {
        // Handle case where token is not found in the cookie
        console.error('Token not found in cookie');
        return;
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Permissions: permissions.join(','),
        },
        body: JSON.stringify(formData),
      });
      
      
  
      if (response.ok) {
        // Handle successful submission
        console.log('Form submitted successfully');
      } else {
        // Handle error
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const [uploadedImages, setUploadedImages] = useState([]);
  const uploaderProps = {
    name: 'image',
    withPreview: true,
    withIcon: false,
    buttonText: 'Select images',
    onChange: (pictures, pictureDataURLs) => {
      setFormData({ ...formData, image: pictureDataURLs });
    },
    imgExtension: ['.jpg', '.gif', '.png', '.gif', 'jpeg'],
    maxFileSize: 5242880,
  };
  
  
  return (
    // <FormProvider {...methods}>
    <form onSubmit={handleSubmit}>

<div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('form:item-description')}
              details={t('form:product-description-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={`${t('form:input-label-name')}*`}
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
        className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
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
          // error={t(errors.price?.message!)}
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
          // Need discussion
          // disabled={isTranslateProduct}
        />

        <Input
          label={`${t('form:input-label-sku')}*`}
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          variant="outline"
          className="mb-5"
          // disabled={isTranslateProduct}
        />
   </Card>
    </div>


    <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:featured-image-title')}
              details={t('form:featured-image-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            {/* <Card className="w-full sm:w-8/12 md:w-2/3">
              <Label>{t('form:images-label')}</Label>
        <ImageUploader {...uploaderProps} />
            </Card> */}

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
            
            <Button >
            {t('form:button-label-add-product')}
            </Button>
          </div>
  
    </form>
  
  );
};

export default MyForm;
