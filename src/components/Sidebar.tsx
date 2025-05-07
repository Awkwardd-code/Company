import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Home, Users, FileText, CalendarClock, Archive, MessageSquare } from 'lucide-react';
import { FiInbox } from 'react-icons/fi';

interface RightSidebarProps {
  variant?: 'default' | 'v2' | 'v3';
}

function RightSidebar({ variant = 'default' }: RightSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLDivElement | null>(null);

  const { user } = useUser();
  const isLoggedIn = !!user?.id;

  const currentUser = useQuery(
    api.users.getUserByToken,
    isLoggedIn
      ? {
          tokenIdentifier: user.id,
        }
      : 'skip'
  );

  const showMeeting = currentUser?.role === 'client' || currentUser?.role === 'programmer';
  const isAdmin = currentUser?.isAdmin;

  const storedSidebarExpanded = typeof window !== 'undefined' ? localStorage.getItem('right-sidebar-expanded') : null;
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // Check screen size and update localStorage for medium screens
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const isLarge = width >= 1024; // lg breakpoint
      const isMedium = width >= 768 && width < 1024; // md to lg breakpoint
      const isMobile = width < 768; // sm breakpoint and below
      setIsLargeScreen(isLarge);
      setIsMobileScreen(isMobile);

      if (typeof window !== 'undefined') {
        try {
          const body = document.querySelector('body');
          if (isMedium) {
            // Set right-sidebar-expanded to true for medium screens
            localStorage.setItem('right-sidebar-expanded', 'true');
            setSidebarExpanded(true);
            if (body) {
              body.classList.add('right-sidebar-expanded');
            }
          } else if (isLarge) {
            // Clear localStorage and reset for large screens
            localStorage.removeItem('right-sidebar-expanded');
            setSidebarExpanded(false);
            if (body) {
              body.classList.remove('right-sidebar-expanded');
            }
          }
        } catch (e) {
          console.error('Failed to access localStorage:', e);
        }
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close on click outside (mobile only)
  useLayoutEffect(() => {
    if (isLargeScreen) return;

    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, isLargeScreen]);

  // Close if the esc key is pressed (mobile only)
  useLayoutEffect(() => {
    if (isLargeScreen) return;

    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, isLargeScreen]);

  // Update localStorage and body class for sidebar expansion (mobile only)
  useLayoutEffect(() => {
    if (isLargeScreen) return;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('right-sidebar-expanded', sidebarExpanded.toString());
        const body = document.querySelector('body');
        if (body) {
          if (sidebarExpanded) {
            body.classList.add('right-sidebar-expanded');
          } else {
            body.classList.remove('right-sidebar-expanded');
          }
        }
      } catch (e) {
        console.error('Failed to access localStorage:', e);
      }
    }
  }, [sidebarExpanded, isLargeScreen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarExpand = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const isActive = (path: string) => pathname === path;

  if (isLargeScreen) return null;

  return (
    <div>
      {/* Menu button (mobile only, styled like TryUsOutButton) */}
      {isMobileScreen && (
        <button
          ref={trigger}
          role="button"
          tabIndex={0}
          className={`relative group inline-flex items-center gap-2 px-2 py-2 rounded-lg border border-blue-400/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-sm sm:text-base font-medium text-blue-300 hover:text-white transition-all duration-300 vibrate-animation cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
          onClick={toggleSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSidebar();
            }
          }}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        >
          <span
            className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"
          />
          <span className="relative z-10 hidden sm:block">Menu</span>
          <svg
            className="w-5 h-5 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 right-0 top-0 h-[100dvh] overflow-y-scroll no-scrollbar bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen && sidebarExpanded ? 'translate-x-0 w-64' : 'translate-x-full w-0 overflow-hidden'} ${variant === 'v2' ? 'border-l border-gray-200 dark:border-gray-700/60' : 'rounded-l-2xl shadow-xs'}`}
        style={{ transitionProperty: 'width, transform, opacity' }}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-2 pl-3 sm:px-2">
          <Link href="/" className="block">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </Link>
          <button
            className="text-gray-500 hover:text-gray-400"
            onClick={toggleSidebar}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3 5.3l-1.4 1.4L16.2 11H4v2h12.2l-4.3 4.3 1.4 1.4L20 12z" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="space-y-8">
          <div>
            <ul className="mt-3">
              {/* Home */}
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive('/') && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}
              >
                <Link
                  href="/"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive('/') ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home
                        className={`shrink-0 ${isActive('/') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                        size={16}
                      />
                      <span
                        className={`text-sm font-medium ml-4 duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'} sidebar-text`}
                      >
                        Home
                      </span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Team */}
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive('/team') && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}
              >
                <Link
                  href="/team"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive('/team') ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users
                        className={`shrink-0 ${isActive('/team') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                        size={16}
                      />
                      <span
                        className={`text-sm font-medium ml-4 duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'} sidebar-text`}
                      >
                        Team
                      </span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Blog */}
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive('/blog') && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}
              >
                <Link
                  href="/blog"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive('/blog') ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText
                        className={`shrink-0 ${isActive('/blog') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                        size={16}
                      />
                      <span
                        className={`text-sm font-medium ml-4 duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'} sidebar-text`}
                      >
                        Blog
                      </span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Meetings (conditional) */}
              {showMeeting && (
                <li
                  className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive('/meetings') && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}
                >
                  <Link
                    href="/meetings"
                    className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive('/meetings') ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarClock
                          className={`shrink-0 ${isActive('/meetings') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                          size={16}
                        />
                        <span
                          className={`text-sm font-medium ml-4 duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'} sidebar-text`}
                        >
                          Meetings
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )}

              {/* Admin or Projects (conditional) */}
              {isAdmin ? (
                <li
                  className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive('/admin') && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}
                >
                  <Link
                    href="/admin"
                    className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive('/admin') ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Archive
                          className={`shrink-0 ${isActive('/admin') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                          size={16}
                        />
                        <span
                          className={`text-sm font-medium ml-4 duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'} sidebar-text`}
                        >
                          Admin
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ) : (
                <li
                  className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive('/projects') && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}
                >
                  <Link
                    href="/projects"
                    className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive('/projects') ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Archive
                          className={`shrink-0 ${isActive('/projects') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                          size={16}
                        />
                        <span
                          className={`text-sm font-medium ml-4 duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'} sidebar-text`}
                        >
                          Projects
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )}

              {/* FAQs */}
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive('/faqs') && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}
              >
                <Link
                  href="/faqs"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive('/faqs') ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare
                        className={`shrink-0 ${isActive('/faqs') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                        size={16}
                      />
                      <span
                        className={`text-sm font-medium ml-4 duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'} sidebar-text`}
                      >
                        FAQs
                      </span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Chat */}
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive('/chat') && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}
              >
                <Link
                  href="/chat"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive('/chat') ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiInbox
                        className={`shrink-0 ${isActive('/chat') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                        size={16}
                      />
                      <span
                        className={`text-sm font-medium ml-4 duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'} sidebar-text`}
                      >
                        Chat
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;