'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Loader2, Upload, AlertCircle, CheckCircle2, Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { calculatePrice, submitQuickOrder, resetOrderState, removeItemPricing } from "@/store/slices/orderSlice";

const UNITS = ["cm", "m", "in", "ft"] as const;

// Single Item Schema
const itemSchema = yup.object().shape({
  width: yup.number().typeError('Must be a number').positive('Must be positive').required('Width is required'),
  height: yup.number().typeError('Must be a number').positive('Must be positive').required('Height is required'),
  unit: yup.string().oneOf(UNITS).required(),
  quantity: yup.number().typeError('Must be a number').integer().min(1).required(),
  notes: yup.string(),
  design_image: yup.mixed()
    .required('Design image is required')
    .test('fileSize', 'The file is too large (max 5MB)', (value: any) => {
      if (!value || !value.length) return true;
      return value[0].size <= 5 * 1024 * 1024;
    }),
});

const schema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  items: yup.array().of(itemSchema).min(1).required(),
  overall_notes: yup.string(),
});

type FormDataValues = yup.InferType<typeof schema>;

// --- Order Item Component ---
const OrderItem = ({
  index,
  fieldId,
  control,
  register,
  remove,
  errors,
  isSingleItem
}: {
  index: number;
  fieldId: string;
  control: Control<FormDataValues>;
  register: any;
  remove: (index: number) => void;
  errors: any;
  isSingleItem: boolean;
}) => {
  const dispatch = useAppDispatch();
  const pricingState = useAppSelector(state => state.orders.pricing[fieldId]);
  const [preview, setPreview] = useState<string | null>(null);

  // Watch fields for this item
  const width = useWatch({ control, name: `items.${index}.width` });
  const height = useWatch({ control, name: `items.${index}.height` });
  const unit = useWatch({ control, name: `items.${index}.unit` });

  // Debounce Price Calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (width && height && unit) {
        let w_cm = Number(width);
        let h_cm = Number(height);

        if (unit === 'm') { w_cm *= 100; h_cm *= 100; }
        if (unit === 'in') { w_cm *= 2.54; h_cm *= 2.54; }
        if (unit === 'ft') { w_cm *= 30.48; h_cm *= 30.48; }

        dispatch(calculatePrice({ id: fieldId, width_cm: w_cm, height_cm: h_cm }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [width, height, unit, fieldId, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const itemErrors = errors.items?.[index];
  const displayPrice = pricingState?.data
    ? Math.round(pricingState.data.final_price / 10) * 10
    : 0;

  return (
    <Card className="p-6 mb-6 shadow-sm border bg-white/50 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-[var(--orange)]" />
          Item #{index + 1}
        </h4>
        {!isSingleItem && (
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <Label>Width</Label>
          <Input type="number" step="any" {...register(`items.${index}.width`)} placeholder="0.00" />
          {itemErrors?.width && <p className="text-red-500 text-sm">{itemErrors.width.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Height</Label>
          <Input type="number" step="any" {...register(`items.${index}.height`)} placeholder="0.00" />
          {itemErrors?.height && <p className="text-red-500 text-sm">{itemErrors.height.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <div className="relative">
            <select
              {...register(`items.${index}.unit`)}
              className="w-full h-9 rounded-full border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {itemErrors?.unit && <p className="text-red-500 text-sm">{itemErrors.unit.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input type="number" min={1} {...register(`items.${index}.quantity`)} />
          {itemErrors?.quantity && <p className="text-red-500 text-sm">{itemErrors.quantity.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Input {...register(`items.${index}.notes`)} placeholder="Specific item notes..." />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <Label>Design Image (Max 5MB)</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-6 h-6 text-gray-400" />
            )}
            <input
              type="file"
              accept="image/*"
              {...register(`items.${index}.design_image`)}
              onChange={(e) => {
                register(`items.${index}.design_image`).onChange(e);
                handleImageChange(e);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-500 flex-1">
            {preview ? "Image selected" : "Click to upload"}
          </p>
        </div>
        {itemErrors?.design_image && <p className="text-red-500 text-sm">{itemErrors.design_image.message}</p>}
      </div>

      {/* Price Display per item */}
      <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Estimate per item:</span>
        <div className="text-right">
          {pricingState?.loading ? (
            <span className="text-sm text-[var(--orange)] flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" /> Calculating...
            </span>
          ) : pricingState?.error ? (
            <span className="text-sm text-red-500">Error</span>
          ) : (
            <span className="text-xl font-serif text-[var(--orange)]">${displayPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Card>
  );
};


export default function OrderPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { client } = useAppSelector(state => state.auth);
  const { submission, pricing } = useAppSelector(state => state.orders);

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<FormDataValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: client?.full_name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      address: client?.address || '',
      overall_notes: '',
      items: [{ width: undefined, height: undefined, unit: 'cm', quantity: 1, notes: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Calculate Total
  const itemsValue = watch('items'); // watch values to get quantity updates
  const totalEstimate = fields.reduce((sum, field, index) => {
    const priceData = pricing[field.id];
    const qty = itemsValue?.[index]?.quantity || 1;
    if (priceData?.data?.final_price) {
      const rounded = Math.round(priceData.data.final_price / 10) * 10;
      return sum + (rounded * qty);
    }
    return sum;
  }, 0);

  // Handle successful submission
  useEffect(() => {
    if (submission.success) {
      toast.success('Order submitted successfully!');
      dispatch(resetOrderState());
      router.push('/profile');
    }
  }, [submission.success, router, dispatch]);

  useEffect(() => {
    if (submission.error) toast.error(submission.error);
  }, [submission.error]);

  const onSubmit = async (data: FormDataValues) => {
    const formData = new FormData();
    if (client?.id) formData.append('client_id', client.id.toString());
    formData.append('delivery_address', data.address);

    let finalNotes = data.overall_notes || '';
    if (!client) {
      finalNotes += `\n\nContact Info:\nName: ${data.full_name}\nEmail: ${data.email}\nPhone: ${data.phone}`;
    }
    formData.append('notes', finalNotes);

    data.items.forEach((item, index) => {
      const fieldId = fields[index].id;
      const priceData = pricing[fieldId];

      formData.append(`items[${index}][width]`, item.width.toString());
      formData.append(`items[${index}][height]`, item.height.toString());
      formData.append(`items[${index}][unit]`, item.unit);
      formData.append(`items[${index}][quantity]`, item.quantity.toString());
      formData.append(`items[${index}][description]`, `Custom Rug ${item.width}x${item.height} ${item.unit}` + (item.notes ? ` - ${item.notes}` : ''));
      if (item.notes) formData.append(`items[${index}][notes]`, item.notes);

      let price = 0;
      if (priceData?.data) {
        price = Math.round(priceData.data.final_price / 10) * 10;
      }
      formData.append(`items[${index}][price_per_item]`, price.toString());

      const fileList = item.design_image as unknown as FileList;
      if (fileList && fileList.length > 0) {
        formData.append(`items[${index}][design_image]`, fileList[0]);
      }
    });

    dispatch(submitQuickOrder(formData));
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-4">
              Quick <span className="text-[var(--orange)] italic font-serif">Order</span>
            </h1>
            <p className="text-muted-foreground text-lg">Customize your rugs and get an instant quote.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Info */}
                <Card className="p-8 shadow-sm border-none bg-white/80 backdrop-blur-sm rounded-xl">
                  <h3 className="text-xl font-medium text-[#2c2420] mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input {...register('full_name')} className="mt-1" />
                      {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input {...register('email')} className="mt-1" />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input {...register('phone')} className="mt-1" />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input {...register('address')} className="mt-1" />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>
                  </div>
                </Card>

                {/* Items */}
                <div>
                  {fields.map((field, index) => (
                    <OrderItem
                      key={field.id}
                      fieldId={field.id}
                      index={index}
                      control={control}
                      register={register}
                      remove={(idx) => {
                        remove(idx);
                        dispatch(removeItemPricing(field.id));
                      }}
                      errors={errors}
                      isSingleItem={fields.length === 1}
                    />
                  ))}

                  <Button
                    type="button"
                    onClick={() => append({ width: undefined as any, height: undefined as any, unit: 'cm', quantity: 1, notes: '' })}
                    variant="outline"
                    className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-[var(--orange)] hover:border-[var(--orange)] rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Another Rug
                  </Button>
                </div>

                {/* Overall Notes */}
                <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-none">
                  <Label>Overall Notes</Label>
                  <Textarea {...register('overall_notes')} placeholder="General instructions for the order..." className="mt-2 rounded-xl" />
                </Card>

                <Button
                  type="submit"
                  disabled={submission.loading}
                  className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white h-12 rounded-full text-lg font-normal"
                >
                  {submission.loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    "Submit Quick Order"
                  )}
                </Button>
              </form>
            </div>

            {/* Sticky Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <Card className="p-6 bg-[#2c2420] text-white border-none rounded-xl shadow-xl">
                  <h3 className="text-xl font-light mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {fields.map((field, index) => {
                      const priceData = pricing[field.id];
                      const currentItem = itemsValue?.[index];
                      const width = currentItem?.width || 0;
                      const height = currentItem?.height || 0;
                      const unit = currentItem?.unit || 'cm';
                      const qty = currentItem?.quantity || 1;
                      const price = priceData?.data ? Math.round(priceData.data.final_price / 10) * 10 : 0;

                      return (
                        <div key={field.id} className="flex justify-between text-sm py-2 border-b border-white/10 last:border-0">
                          <div>
                            <p className="font-medium">Item #{index + 1}</p>
                            <p className="text-white/60 text-xs">{width}x{height} {unit} (x{qty})</p>
                          </div>
                          <div className="text-right">
                            <p>${(price * qty).toLocaleString()}</p>
                            {priceData?.loading && <span className="text-[var(--orange)] text-[10px]">Calculating...</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-lg">Total Estimate</span>
                      <div className="text-right">
                        <div className="text-3xl font-serif text-[var(--orange)]">
                          ${totalEstimate.toLocaleString()}
                        </div>
                        <p className="text-xs text-white/50 mt-1">Rounded to nearest 10th</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="mt-4 p-6 bg-white border-none rounded-xl shadow-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Secure Ordering</h4>
                      <p className="text-sm text-gray-500">
                        Your order is processed securely. We will contact you to confirm the design before production.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
