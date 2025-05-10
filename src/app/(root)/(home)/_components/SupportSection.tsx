"use client";

import Link from 'next/link';
import { FC, FormEvent, useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useMutation, useQuery } from "convex/react";
import { api } from '../../../../../convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { Doc, Id } from '../../../../../convex/_generated/dataModel';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  rating: number;
  termsAccepted: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  rating?: string;
  termsAccepted?: string;
}

interface UserDoc {
  _id: Id<"users">;
  _creationTime: number;
  image?: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role: "client" | "user" | "programmer";
  tokenIdentifier: string;
  isOnline: boolean;
}

type UserIdentity = Doc<"users"> | null | undefined;

function isUserDoc(userIdentity: UserIdentity): userIdentity is UserDoc {
  return userIdentity != null && '_id' in userIdentity;
}

const SupportSection: FC = () => {
  const { userId } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(userId !== null);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);

  const userIdentity = useQuery(api.users.getMe, isAuthenticated ? {} : "skip");
  const insertSupportMessage = useMutation(api.supportMessages.insertSupportMessage);

  useEffect(() => {
    if (userId) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userIdentity !== undefined) {
      setIsUserLoaded(true);
    }
  }, [userIdentity]);

  const hasSubmitted = useQuery(
    api.supportMessages.hasUserSubmitted,
    isAuthenticated && isUserDoc(userIdentity)
      ? { userId: userIdentity._id }
      : "skip"
  ) ?? false;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    rating: 3,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
    setErrors((prev) => ({ ...prev, termsAccepted: '' }));
  };

  const handleRatingChange = (value: string) => {
    const rating = Number(value);
    setFormData((prev) => ({ ...prev, rating }));
    validateField('rating', rating);
  };

  const validateField = (name: string, value: string | number | boolean) => {
    const newErrors: FormErrors = { ...errors };

    if (name === 'name') {
      if (!value) newErrors.name = 'Name is required';
      else if ((value as string).length > 100) newErrors.name = 'Name must be less than 100 characters';
      else delete newErrors.name;
    }

    if (name === 'email') {
      if (!value) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(value as string)) newErrors.email = 'Invalid email format';
      else if ((value as string).length > 100) newErrors.email = 'Email must be less than 100 characters';
      else delete newErrors.email;
    }

    if (name === 'subject' && !value) newErrors.subject = 'Subject is required';
    else if (name === 'subject' && (value as string).length > 200) newErrors.subject = 'Subject must be less than 200 characters';
    else delete newErrors.subject;

    if (name === 'message' && !value) newErrors.message = 'Message is required';
    else if (name === 'message' && (value as string).length > 5000) newErrors.message = 'Message must be less than 5000 characters';
    else delete newErrors.message;

    if (name === 'rating') {
      const ratingValue = Number(value);
      if (isNaN(ratingValue)) newErrors.rating = 'Rating must be a number';
      else if (!Number.isInteger(ratingValue)) newErrors.rating = 'Rating must be a whole number';
      else if (ratingValue < 1 || ratingValue > 5) newErrors.rating = 'Rating must be between 1 and 5';
      else delete newErrors.rating;
    }

    setErrors(newErrors);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!isAuthenticated) {
      alert('Please log in to submit a message.');
      return;
    }

    if (!isUserDoc(userIdentity)) {
      alert('User account not found. Please contact support or try logging in again.');
      return;
    }

    try {
      await insertSupportMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
        rating: formData.rating,
        termsAccepted: formData.termsAccepted,
      });
      alert('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        rating: 3,
        termsAccepted: false
      });
      setErrors({});
    } catch (error: any) {
      console.error('Form submission error:', error);
      if (error.message?.includes('already submitted')) {
        alert('You have already submitted a message.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  const email = 'info.codecraft.soft@gmail.com';
  const encodeEmail = (email: string) => {
    return email.replace(/./g, (char) => `&#${char.charCodeAt(0)};`);
  };
  const encodedEmail = encodeEmail(email);

  const renderStars = useMemo(() => (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <svg
          key={starValue}
          className={`w-4 h-4 ${starValue <= rating ? 'fill-indigo-600' : 'text-gray-300 dark:text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  ), []);

  return (
    <section id="support" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12 lg:mb-16">
        
          {/* Section Title */}
          <div
            className="relative mx-auto mb-12 max-w-[620px] pt-6 text-center md:mb-20 lg:pt-16"
            data-wow-delay=".2s"
          >
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 text-[40px] sm:text-[60px] lg:text-[95px] font-extrabold leading-none opacity-20"
              style={{
                background: 'linear-gradient(180deg, rgba(74, 108, 247, 0.4) 0%, rgba(74, 108, 247, 0) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              SUPPORT
            </span>

            <h2 className="font-heading text-dark mb-5 text-3xl font-semibold sm:text-4xl md:text-[50px] md:leading-[60px] dark:text-white">
              Let's Connect
            </h2>
            <p className="text-dark-text text-base">
              Have questions or need assistance? Our team is here to help you succeed.
            </p>
          </div>
          <div className="lg:w-1/3 relative group">
            <div className="flex items-center justify-center lg:justify-end">
              <span className="bg-indigo-500 dark:bg-indigo-400 mr-4 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-16"></span>
              <Link
                href={`mailto:${email}`}
                className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                dangerouslySetInnerHTML={{ __html: encodedEmail }}
                aria-label="Send us an email"
              />
            </div>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs rounded-full py-1 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Secured Email
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6">
              <div className="w-full">
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:shadow-md`}
                  required
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.name}</p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:shadow-md`}
                  required
                  maxLength={100}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.email}</p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 border-gray-300 dark:border-gray-600 focus:shadow-md"
                  maxLength={20}
                />
              </div>
              <div className="w-full">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:shadow-md`}
                  required
                  maxLength={200}
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.subject}</p>
                )}
              </div>
              <div className="sm:col-span-2 w-full">
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  name="message"
                  id="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:shadow-md`}
                  required
                  maxLength={5000}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.message}</p>
                )}
              </div>
              <div className="sm:col-span-2 w-full space-y-2">
                <Label>Rate Our Support</Label>
                <Select value={formData.rating.toString()} onValueChange={handleRatingChange}>
                  <SelectTrigger className={`w-full px-6 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 ${errors.rating ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:shadow-md`}>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        <div className="flex items-center gap-2">{renderStars(value)}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.rating && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.rating}</p>
                )}
              </div>
              <div className="sm:col-span-2 w-full">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    id="supportCheckbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleCheckboxChange}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center mr-3 transition-all duration-300 ${formData.termsAccepted ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-400'}`}>
                    {formData.termsAccepted && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    I agree to the <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.termsAccepted}</p>
                )}
              </div>
              <div className="sm:col-span-2 w-full">
                {!isAuthenticated ? (
                  <>
                    <p className="text-red-500 text-sm mb-2">
                      Please <Link href="/sign-in" className="text-indigo-600 dark:text-indigo-400 hover:underline">log in</Link> to submit a message.
                    </p>
                    <button
                      type="button"
                      disabled
                      className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg opacity-50 cursor-not-allowed shadow-md"
                    >
                      Send Message
                    </button>
                  </>
                ) : !isUserDoc(userIdentity) || !isUserLoaded ? (
                  <>
                    <p className="text-red-500 text-sm mb-2">
                      User account not found. Please contact support or try logging in again.
                    </p>
                    <button
                      type="button"
                      disabled
                      className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg opacity-50 cursor-not-allowed shadow-md"
                    >
                      Send Message
                    </button>
                  </>
                ) : hasSubmitted ? (
                  <>
                    <p className="text-red-500 text-sm mb-2">
                      You have already submitted a message.
                    </p>
                    <button
                      type="button"
                      disabled
                      className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg opacity-50 cursor-not-allowed shadow-md"
                    >
                      Send Message
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                  >
                    Send Message
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;