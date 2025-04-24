"use client";
import Link from 'next/link';
import { FC, FormEvent, useState } from 'react';

// Define interface for form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  termsAccepted: boolean;
}

const SupportSection: FC = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    termsAccepted: false,
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert('Please accept the terms and privacy policy.');
      return;
    }
    try {
      const response = await fetch('https://formbold.com/s/unique_form_id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', termsAccepted: false });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: <FacebookIcon />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <TwitterIcon />, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <LinkedInIcon />, url: 'https://linkedin.com' },
    { name: 'Instagram', icon: <InstagramIcon />, url: 'https://instagram.com' },
  ];

  // Email encryption function (simple obfuscation)
  const encodeEmail = (email: string) => {
    return email.replace(/./g, (char) => `&#${char.charCodeAt(0)};`);
  };

  // Decrypt email for mailto link (for user interaction)
  const email = 'support@example.com';
  const encodedEmail = encodeEmail(email);

  return (
    <section id="support" className="pt-14 sm:pt-20 lg:pt-[130px] bg-transparent">
      <div className="px-4 xl:container mx-auto">
        {/* Section Title and Email Link */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-[#2E333D] pb-14 mb-12 max-w-4xl mx-auto">
          <div className="w-full lg:w-1/2 px-4">
            <div
              className="relative mb-12 max-w-[500px] pt-6 md:mb-14 lg:pt-16"
              data-wow-delay=".2s"
            >
              <span
                className="absolute top-0 left-0 text-[40px] sm:text-[60px] lg:text-[95px] leading-[1] font-extrabold opacity-20 bg-gradient-to-b from-[rgba(74,108,247,0.4)] to-[rgba(74,108,247,0)] bg-clip-text text-transparent"
              >
                SUPPORT
              </span>
              <h2 className="font-heading text-dark mb-5 text-3xl font-semibold sm:text-4xl md:text-[50px] md:leading-[60px] dark:text-white">
                Need Any Help? Say Hello
              </h2>
              <p className="text-dark-text text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae tortor aliquam ante.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 px-4">
            <div className="flex items-center justify-center lg:justify-end relative group" data-wow-delay=".2s">
              <span className="bg-dark mr-4 h-1 w-24 dark:bg-white"></span>
              <Link
                href={`mailto:${email}`}
                className="font-heading text-dark text-xl md:text-3xl lg:text-2xl xl:text-3xl dark:text-white hover:text-blue-600 transition-colors duration-300"
                dangerouslySetInnerHTML={{ __html: encodedEmail }}
              />
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Secured Email
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information and Social Links */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-heading text-dark mb-3 text-lg font-semibold dark:text-white">
                Email Address
              </h3>
              <p className="text-dark-text text-base font-medium">
                <Link href={`mailto:${email}`} className="hover:text-blue-600 transition-colors duration-300">
                  {email}
                </Link>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-heading text-dark mb-3 text-lg font-semibold dark:text-white">
                Phone Number
              </h3>
              <p className="text-dark-text text-base font-medium">
                +009 8754 3433 223
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-heading text-dark mb-3 text-lg font-semibold dark:text-white">
                Office Location
              </h3>
              <p className="text-dark-text text-base font-medium">
                76/A, Green Valle, California USA
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-center items-center">
              <div className="flex items-center space-x-5">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.url}
                    aria-label={link.name}
                    className="text-dark-text hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mx-auto max-w-[780px] pt-10">
          <form onSubmit={handleSubmit} data-wow-delay=".2s" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full sm:w-1/2 px-4 mb-6">
                <label
                  htmlFor="name"
                  className="font-heading text-dark mb-3 block text-base font-medium dark:text-white"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-dark placeholder-dark-text focus:border-blue-600 w-full border-b border-gray-300 dark:border-[#2C3443] bg-transparent py-4 text-base font-medium outline-none dark:text-white dark:focus:border-blue-400 transition-colors duration-300"
                  required
                />
              </div>
              <div className="w-full sm:w-1/2 px-4 mb-6">
                <label
                  htmlFor="email"
                  className="font-heading text-dark mb-3 block text-base font-medium dark:text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-dark placeholder-dark-text focus:border-blue-600 w-full border-b border-gray-300 dark:border-[#2C3443] bg-transparent py-4 text-base font-medium outline-none dark:text-white dark:focus:border-blue-400 transition-colors duration-300"
                  required
                />
              </div>
              <div className="w-full sm:w-1/2 px-4 mb-6">
                <label
                  htmlFor="phone"
                  className="font-heading text-dark mb-3 block text-base font-medium dark:text-white"
                >
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="text-dark placeholder-dark-text focus:border-blue-600 w-full border-b border-gray-300 dark:border-[#2C3443] bg-transparent py-4 text-base font-medium outline-none dark:text-white dark:focus:border-blue-400 transition-colors duration-300"
                />
              </div>
              <div className="w-full sm:w-1/2 px-4 mb-6">
                <label
                  htmlFor="subject"
                  className="font-heading text-dark mb-3 block text-base font-medium dark:text-white"
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder="Type Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="text-dark placeholder-dark-text focus:border-blue-600 w-full border-b border-gray-300 dark:border-[#2C3443] bg-transparent py-4 text-base font-medium outline-none dark:text-white dark:focus:border-blue-400 transition-colors duration-300"
                  required
                />
              </div>
              <div className="w-full px-4 mb-6">
                <label
                  htmlFor="message"
                  className="font-heading text-dark mb-3 block text-base font-medium dark:text-white"
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  name="message"
                  id="message"
                  placeholder="Type Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="text-dark placeholder-dark-text focus:border-blue-600 w-full resize-none border-b border-gray-300 dark:border-[#2C3443] bg-transparent py-4 text-base font-medium outline-none dark:text-white dark:focus:border-blue-400 transition-colors duration-300"
                  required
                ></textarea>
              </div>
              <div className="w-full px-4 mb-6">
                <label
                  htmlFor="supportCheckbox"
                  className="text-dark-text hover:text-blue-600 flex cursor-pointer select-none items-center dark:hover:text-blue-400"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="supportCheckbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div className="box mt-1 mr-4 flex h-5 w-5 items-center justify-center rounded-sm border dark:border-[#414652] transition-colors duration-300">
                      <span className={formData.termsAccepted ? 'opacity-100' : 'opacity-0'}>
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          className="stroke-current text-blue-600 dark:text-blue-400"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            strokeWidth="0.4"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  I have read the terms of the Service & I accept Privacy Policy
                </label>
              </div>
              <div className="w-full px-4">
                <button
                  type="submit"
                  className="bg-blue-600 font-heading hover:bg-blue-700 flex w-full items-center justify-center rounded-lg px-8 py-4 text-base text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// Social media icons as components
const FacebookIcon: FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
    <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z" />
  </svg>
);

const TwitterIcon: FC = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9831 19.25L9.82094 13.3176L4.61058 19.25H2.40625L8.843 11.9233L2.40625 2.75H8.06572L11.9884 8.34127L16.9034 2.75H19.1077L12.9697 9.73737L19.6425 19.25H13.9831ZM16.4378 17.5775H14.9538L5.56249 4.42252H7.04674L10.808 9.6899L11.4584 10.6039L16.4378 17.5775Z"
      fill="currentColor"
    />
  </svg>
);

const LinkedInIcon: FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
    <path d="M6.93994 5.00002C6.93968 5.53046 6.72871 6.03906 6.35345 6.41394C5.97819 6.78883 5.46938 6.99929 4.93894 6.99902C4.40851 6.99876 3.89991 6.78779 3.52502 6.41253C3.15014 6.03727 2.93968 5.52846 2.93994 4.99802C2.94021 4.46759 3.15117 3.95899 3.52644 3.5841C3.9017 3.20922 4.41051 2.99876 4.94094 2.99902C5.47137 2.99929 5.97998 3.21026 6.35486 3.58552C6.72975 3.96078 6.94021 4.46959 6.93994 5.00002ZM6.99994 8.48002H2.99994V21H6.99994V8.48002ZM13.3199 8.48002H9.33994V21H13.2799V14.43C13.2799 10.77 18.0499 10.43 18.0499 14.43V21H21.9999V13.07C21.9999 6.90002 14.9399 7.13002 13.2799 10.16L13.3199 8.48002Z" />
  </svg>
);

const InstagramIcon: FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
    <path d="M7.443 5.34961C8.082 5.34961 8.673 5.39961 9.213 5.54761C9.70302 5.63765 10.1708 5.82244 10.59 6.09161C10.984 6.33861 11.279 6.68561 11.475 7.13061C11.672 7.57561 11.77 8.12061 11.77 8.71361C11.77 9.40661 11.623 9.99961 11.279 10.4446C10.984 10.8906 10.492 11.2856 9.902 11.5826C10.738 11.8306 11.377 12.2756 11.77 12.8686C12.164 13.4626 12.41 14.2046 12.41 15.0456C12.41 15.7386 12.262 16.3316 12.016 16.8266C11.77 17.3216 11.377 17.7666 10.934 18.0636C10.4528 18.382 9.92084 18.616 9.361 18.7556C8.771 18.9046 8.181 19.0036 7.591 19.0036H1V5.34961H7.443ZM7.049 10.8896C7.59 10.8896 8.033 10.7416 8.377 10.4946C8.721 10.2476 8.869 9.80161 8.869 9.25761C8.869 8.96061 8.819 8.66361 8.721 8.46661C8.623 8.26861 8.475 8.11961 8.279 7.97161C8.082 7.87261 7.885 7.77361 7.639 7.72461C7.393 7.67461 7.148 7.67461 6.852 7.67461H4V10.8906H7.05L7.049 10.8896ZM7.197 16.7276C7.492 16.7276 7.787 16.6776 8.033 16.6286C8.28138 16.5814 8.51628 16.48 8.721 16.3316C8.92139 16.1868 9.08903 16.0015 9.213 15.7876C9.311 15.5406 9.41 15.2436 9.41 14.8976C9.41 14.2046 9.213 13.7096 8.82 13.3636C8.426 13.0666 7.885 12.9186 7.246 12.9186H4V16.7286H7.197V16.7276ZM16.689 16.6776C17.082 17.0736 17.672 17.2716 18.459 17.2716C19 17.2716 19.492 17.1236 19.885 16.8766C20.279 16.5796 20.525 16.2826 20.623 15.9856H23.033C22.639 17.1726 22.049 18.0136 21.263 18.5576C20.475 19.0526 19.541 19.3496 18.41 19.3496C17.6864 19.3518 16.9688 19.2175 16.295 18.9536C15.6887 18.7262 15.148 18.3524 14.721 17.8656C14.2643 17.4102 13.9267 16.8494 13.738 16.2326C13.492 15.5896 13.393 14.8976 13.393 14.1056C13.393 13.3636 13.492 12.6716 13.738 12.0276C13.9745 11.4077 14.3245 10.8373 14.77 10.3456C15.213 9.90061 15.754 9.50561 16.344 9.25761C17.0007 8.99367 17.7022 8.8592 18.41 8.86161C19.246 8.86161 19.984 9.01061 20.623 9.35661C21.263 9.70261 21.754 10.0986 22.148 10.6926C22.5499 11.2631 22.8494 11.8993 23.033 12.5726C23.131 13.2646 23.18 13.9576 23.131 14.7486H16C16 15.5406 16.295 16.2826 16.689 16.6786V16.6776ZM19.787 11.4836C19.443 11.1376 18.902 10.9396 18.262 10.9396C17.82 10.9396 17.475 11.0386 17.18 11.1866C16.885 11.3356 16.689 11.5336 16.492 11.7316C16.311 11.9229 16.1912 12.1638 16.148 12.4236C16.098 12.6716 16.049 12.8686 16.049 13.0666H20.475C20.377 12.3246 20.131 11.8306 19.787 11.4836ZM15.459 6.28961H20.967V7.62561H15.46V6.28961H15.459Z" />
  </svg>
);

export default SupportSection;