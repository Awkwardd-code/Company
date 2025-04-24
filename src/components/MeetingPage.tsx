"use client";

import { useState, useEffect } from 'react';
import { format, isWithinInterval, addHours } from 'date-fns';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CreateMeetingForm from '../app/(root)/meeting-section/meetings/_components/CreateMeetingForm';
import Link from 'next/link';

// Define types for the meeting
interface Meeting {
  id: number;
  title: string;
  description: string;
  host: string;
  date: string;
  platform: string;
  status: 'upcoming' | 'completed';
  attendees: number[];
}

// Mock data for meetings
const mockMeetings: Meeting[] = [
  {
    id: 1,
    title: 'Weekly Team Sync',
    description: 'Discuss project updates and next steps.',
    host: 'Alice Johnson',
    date: '2025-04-16T11:30:00Z', // Live meeting: April 16, 2025, 11:30 UTC (live from 11:30 to 12:30 UTC)
    platform: 'Zoom',
    status: 'upcoming',
    attendees: [],
  },
  {
    id: 2,
    title: 'Client Presentation',
    description: 'Present Q2 roadmap to stakeholders.',
    host: 'Bob Smith',
    date: '2025-04-16T12:00:00Z', // Live meeting: April 16, 2025, 12:00 UTC (live from 12:00 to 13:00 UTC)
    platform: 'Microsoft Teams',
    status: 'upcoming',
    attendees: [],
  },
  {
    id: 3,
    title: 'Retrospective',
    description: 'Review sprint outcomes and improvements.',
    host: 'Carol White',
    date: '2025-04-15T16:00:00Z', // Past meeting: April 15, 2025, 16:00 UTC
    platform: 'Google Meet',
    status: 'completed',
    attendees: [],
  },
  {
    id: 4,
    title: 'Design Review',
    description: 'Review UI designs for the new app.',
    host: 'David Lee',
    date: '2025-04-16T14:00:00Z', // Future meeting: April 16, 2025, 14:00 UTC (not live yet)
    platform: 'Zoom',
    status: 'upcoming',
    attendees: [],
  },
  {
    id: 5,
    title: 'Planning Session',
    description: 'Plan the next sprint.',
    host: 'Emma Brown',
    date: '2025-04-16T10:00:00Z', // Past meeting (but still upcoming status): April 16, 2025, 10:00 UTC (ended at 11:00 UTC)
    platform: 'Google Meet',
    status: 'upcoming',
    attendees: [],
  },
];

// Define props for MeetingSkeleton
interface MeetingSkeletonProps {
  isListView: boolean;
}

// Skeleton Loader Component
const MeetingSkeleton: React.FC<MeetingSkeletonProps> = ({ isListView }) => (
  <div className={`relative group ${isListView ? 'w-full' : ''}`}>
    <div className="bg-[#1e1e2e]/80 rounded-xl border border-[#313244]/50 overflow-hidden h-[280px]">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-800 animate-pulse" />
            <div className="space-y-2">
              <div className="w-24 h-6 bg-gray-800 rounded-lg animate-pulse" />
              <div className="w-20 h-4 bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="w-16 h-8 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="w-3/4 h-7 bg-gray-800 rounded-lg animate-pulse" />
          <div className="w-1/2 h-5 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-2 bg-black/30 rounded-lg p-4">
          <div className="w-full h-4 bg-gray-800 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

// Define props for MeetingCard
interface MeetingCardProps {
  meeting: Meeting;
  isListView: boolean;
}

// Meeting Card Component
const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, isListView }) => {
  const [isJoining, setIsJoining] = useState(false);

  // Determine if the meeting is live
  const isMeetingLive = () => {
    const now = new Date(); // Current time
    const startTime = new Date(meeting.date);
    const endTime = addHours(startTime, 1); // Assume 1-hour duration

    return isWithinInterval(now, { start: startTime, end: endTime });
  };

  const handleJoinClick = () => {
    setIsJoining(true);
  };

  return (
    <div
      className={`relative group transition-transform hover:scale-[1.02] ${
        isListView ? 'w-full' : ''
      }`}
    >
      <div
        className={`bg-[#1e1e2e]/80 rounded-xl border border-[#313244]/50 overflow-hidden shadow-lg ${
          isListView ? 'h-auto min-h-[140px]' : 'h-[280px]'
        }`}
      >
        <div className={`p-6 ${isListView ? 'flex items-center space-x-6' : 'space-y-4'}`}>
          <div className={`flex items-start gap-3 ${isListView ? 'w-2/3' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 font-semibold">
                {meeting.host[0].toUpperCase()}
              </span>
            </div>
            <div className={isListView ? 'flex-1' : ''}>
              <div
                className={`flex ${isListView ? 'items-center' : 'justify-between items-start'}`}
              >
                <div>
                  <p className="text-white font-medium">{meeting.host}</p>
                  <p className="text-gray-400 text-sm">
                    {format(new Date(meeting.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    isMeetingLive()
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : meeting.status === 'upcoming'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  } ${isListView ? 'ml-4' : ''}`}
                >
                  {isMeetingLive() ? 'Live' : meeting.status}
                </span>
              </div>
              <h3
                className={`text-xl font-semibold text-white ${
                  isListView ? 'mt-1' : 'mt-2'
                }`}
              >
                {meeting.title}
              </h3>
              <p
                className={`text-gray-400 text-sm ${
                  isListView ? 'line-clamp-1' : 'line-clamp-2'
                }`}
              >
                {meeting.description}
              </p>
            </div>
          </div>
          <div
            className={`bg-black/30 rounded-lg p-4 ${
              isListView ? 'w-1/3 flex flex-col justify-center' : 'mt-4'
            }`}
          >
            <p className="text-gray-300 text-sm">
              <span className="font-medium">Time:</span>{' '}
              {format(new Date(meeting.date), 'h:mm a')}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-medium">Platform:</span> {meeting.platform}
            </p>
            {meeting.status === 'upcoming' && isMeetingLive() && (
              <Link href={`/meeting/${meeting.id}`}>
                <Button
                  className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                  disabled={isJoining}
                  onClick={handleJoinClick}
                >
                  {isJoining ? 'Joining...' : 'Join Meeting'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isListView, setIsListView] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateMeeting = (newMeeting: Meeting) => {
    setMeetings((prev) => [...prev, newMeeting]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status: 'all' | 'upcoming' | 'completed') => {
    setStatusFilter(status);
  };

  const toggleListView = () => {
    setIsListView((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="container max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Meetings</h1>
            <p className="text-gray-400 mt-1">
              Schedule and manage your meetings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Schedule Meeting
                </Button>
              </DialogTrigger>
              <CreateMeetingForm
                open={open}
                setOpen={setOpen}
                onSubmit={handleCreateMeeting}
              />
            </Dialog>
            <Button
              onClick={toggleListView}
              className="bg-[#1e1e2e]/80 p-2 rounded-lg border border-[#313244] hover:bg-[#1e1e2e] transition"
            >
              {isListView ? (
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full h-12 bg-[#1e1e2e]/80 rounded-xl border border-[#313244] text-white placeholder-gray-400 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-2">
            {(['all', 'upcoming', 'completed'] as const).map((status) => (
              <Button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  statusFilter === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#1e1e2e]/80 text-gray-300 hover:bg-[#1e1e2e]'
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <svg
              className="w-8 h-8 animate-spin text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
          </div>
        ) : filteredMeetings.length > 0 ? (
          <div className={isListView ? 'space-y-6' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}>
            {filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                isListView={isListView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No meetings scheduled
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;