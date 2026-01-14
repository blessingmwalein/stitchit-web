'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAppDispatch } from '@/store/hooks';
import { completeGoogleRegistration } from '@/store/slices/authSlice';
import { toast } from 'sonner';

const REG_DATA_KEY = 'google_registration_data';

// Local schema for the form (splitting full_name query).
const formSchema = yup.object().shape({
  google_id: yup.string().required('google_id is required'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  avatar: yup.string().nullable().notRequired(),
  phone: yup.string().required('Phone number is required').max(20, 'Phone number must be at most 20 characters'),
  username: yup.string().nullable().notRequired().max(255, 'Username must be at most 255 characters'),
  address: yup.string().nullable().notRequired(),
  gender: yup
    .mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'])
    .nullable()
    .notRequired(),
});

type FormValues = yup.InferType<typeof formSchema>;

export default function GoogleRegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // We'll store the raw initial data to hydrate the form defaults
  const [initial, setInitial] = useState<{
    google_id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(REG_DATA_KEY);
    if (!raw) {
      router.replace('/auth/login');
      return;
    }

    try {
      const parsed = JSON.parse(raw) as any;
      // Handle potential nested "data" structure (e.g. { success: true, data: { ... } })
      const data = parsed.data || parsed;

      const fullName = data.full_name || '';
      // Split full_name into first and last
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setInitial({
        google_id: data.google_id || '',
        email: data.email || '',
        first_name: firstName,
        last_name: lastName,
        avatar: data.avatar || undefined,
      });
    } catch {
      sessionStorage.removeItem(REG_DATA_KEY);
      router.replace('/auth/login');
    }
  }, [router]);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      google_id: '',
      email: '',
      first_name: '',
      last_name: '',
      avatar: null,
      phone: '',
      username: null,
      address: null,
      gender: null,
    },
  });

  // When initial data is ready, reset the form with those values
  useEffect(() => {
    if (initial) {
      // If critical data is missing, redirect
      if (!initial.google_id || !initial.email) {
        sessionStorage.removeItem(REG_DATA_KEY);
        router.replace('/auth/login');
        return;
      }

      reset({
        google_id: initial.google_id,
        email: initial.email,
        first_name: initial.first_name,
        last_name: initial.last_name,
        avatar: initial.avatar || null,
        phone: '',
        username: null,
        address: null,
        gender: null,
      });
    }
  }, [initial, router, reset]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      // Combine first and last name back to full_name for the backend
      const full_name = `${values.first_name} ${values.last_name}`.trim();

      await dispatch(
        completeGoogleRegistration({
          google_id: values.google_id,
          email: values.email,
          full_name,
          avatar: values.avatar || undefined,
          phone: values.phone,
          username: values.username || undefined,
          address: values.address || undefined,
          gender: values.gender || undefined,
        })
      ).unwrap();

      sessionStorage.removeItem(REG_DATA_KEY);

      toast.success('Registration complete');
      router.replace('/profile');
    } catch (err: any) {
      if (err?.errors && typeof err.errors === 'object') {
        Object.entries(err.errors as Record<string, string[]>).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : undefined;
          if (!message) return;

          // If backend returns error on 'full_name', map it to first_name or handle appropriately
          if (field === 'full_name') {
            setError('first_name', { type: 'server', message });
          } else if (field in values) {
            setError(field as keyof FormValues, { type: 'server', message });
          }
        });
      }
      const message = err?.message || 'Registration failed. Please try again.';
      setServerError(message);
      toast.error(message);
    }
  };

  if (!initial) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Card className="p-8 md:p-10 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            {initial.avatar ? (
              <Image
                src={initial.avatar}
                alt="Google avatar"
                width={56}
                height={56}
                className="rounded-full"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[var(--orange)]/10" />
            )}
            <div>
              <h1 className="text-2xl font-light text-[#2c2420]">
                Complete <span className="text-[var(--orange)] italic font-serif">Registration</span>
              </h1>
              <p className="text-sm text-muted-foreground">One more step to finish Google signup</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register('google_id')} />
            <input type="hidden" {...register('avatar')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="mb-2 block">First Name</Label>
                <Input id="first_name" {...register('first_name')} className="rounded-full h-12" />
                {errors.first_name && <p className="text-red-500 text-sm mt-2">{errors.first_name.message}</p>}
              </div>

              <div>
                <Label htmlFor="last_name" className="mb-2 block">Last Name</Label>
                <Input id="last_name" {...register('last_name')} className="rounded-full h-12" />
                {errors.last_name && <p className="text-red-500 text-sm mt-2">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">Email</Label>
              <Input id="email" type="email" {...register('email')} disabled className="rounded-full h-12" />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="mb-2 block">Phone *</Label>
              <Input id="phone" {...register('phone')} placeholder="+263771234567" className={`rounded-full h-12 ${errors.phone ? 'border-red-500' : ''}`} />
              {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username" className="mb-2 block">Username (optional)</Label>
                <Input id="username" {...register('username')} placeholder="Optional" className="rounded-full h-12" />
                {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username.message}</p>}
              </div>

              <div>
                <Label htmlFor="gender" className="mb-2 block">Gender (optional)</Label>
                <select
                  id="gender"
                  {...register('gender')}
                  className="w-full rounded-full h-12 px-4 border border-input bg-background"
                  defaultValue=""
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender.message as string}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="mb-2 block">Address (optional)</Label>
              <Input id="address" {...register('address')} placeholder="123 Main St, Harare" className="rounded-full h-12" />
              {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address.message}</p>}
            </div>

            {serverError && <p className="text-red-600 text-sm text-center">{serverError}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full h-12"
            >
              {isSubmitting ? 'Completing…' : 'Complete Registration'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
