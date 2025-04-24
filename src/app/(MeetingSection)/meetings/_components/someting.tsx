"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon, SearchIcon, LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";
import { api } from "../../../../../convex/_generated/api";

// Define Interview type for TypeScript
interface Interview {
    _id: string;
    title?: string;
    description?: string;
    startTime: number;
    status: string;
    streamCallId: string;
    candidateId: string;
    interviewerIds: string[];
}

function InterviewScheduleUI() {
    const client = useStreamVideoClient();
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isColumnLayout, setIsColumnLayout] = useState(false);

    const interviews = useQuery(api.interviews.getAllInterviews) as Interview[] | null ?? [];
    const users = useQuery(api.users.getUsers) ?? [];
    const createInterview = useMutation(api.interviews.createInterview);

    const candidates = users?.filter((u) => u.role === "client");
    const interviewers = users?.filter((u) => u.role === "programmer");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
    });

    const scheduleMeeting = async () => {
        if (!client || !user) return;
        if (!formData.candidateId || formData.interviewerIds.length === 0) {
            toast.error("Please select both candidate and at least one interviewer");
            return;
        }

        setIsCreating(true);

        try {
            const { title, description, date, time, candidateId, interviewerIds } = formData;
            const [hours, minutes] = time.split(":");
            const meetingDate = new Date(date);
            meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

            const id = crypto.randomUUID();
            const call = client.call("default", id);

            await call.getOrCreate({
                data: {
                    starts_at: meetingDate.toISOString(),
                    custom: {
                        description: title,
                        additionalDetails: description,
                    },
                },
            });

            await createInterview({
                title,
                description,
                startTime: meetingDate.getTime(),
                status: "upcoming",
                streamCallId: id,
                candidateId,
                interviewerIds,
            });

            setOpen(false);
            toast.success("Meeting scheduled successfully!");

            setFormData({
                title: "",
                description: "",
                date: new Date(),
                time: "09:00",
                candidateId: "",
                interviewerIds: user?.id ? [user.id] : [],
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to schedule meeting. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    const addInterviewer = (interviewerId: string) => {
        if (!formData.interviewerIds.includes(interviewerId)) {
            setFormData((prev) => ({
                ...prev,
                interviewerIds: [...prev.interviewerIds, interviewerId],
            }));
        }
    };

    const removeInterviewer = (interviewerId: string) => {
        if (interviewerId === user?.id) return;
        setFormData((prev) => ({
            ...prev,
            interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
        }));
    };

    const selectedInterviewers = interviewers.filter((i) =>
        formData.interviewerIds.includes(i.tokenIdentifier)
    );

    const availableInterviewers = interviewers.filter(
        (i) => !formData.interviewerIds.includes(i.tokenIdentifier)
    );

    // Filter interviews based on search query
    const filteredInterviews = interviews.filter((interview) =>
        (interview.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (interview.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort interviews: live meetings first, then by start time
    const sortedInterviews = [...filteredInterviews].sort((a, b) => {
        const now = Date.now();
        const DEFAULT_DURATION_MS = 60 * 60 * 1000; // 1 hour
        const aStart = a.startTime;
        const aEnd = aStart + DEFAULT_DURATION_MS;
        const bStart = b.startTime;
        const bEnd = bStart + DEFAULT_DURATION_MS;

        const aIsLive = now >= aStart && now <= aEnd;
        const bIsLive = now >= bStart && now <= bEnd;

        if (aIsLive && !bIsLive) return -1; // a is live, b is not
        if (!aIsLive && bIsLive) return 1;  // b is live, a is not
        return aStart - bStart; // Sort by start time for non-live meetings
    });

    return (
        <div className="container max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                {/* HEADER INFO */}
                <div>
                    <h1 className="text-3xl font-bold">Meetings</h1>
                    <p className="text-muted-foreground mt-1">Schedule and manage interviews</p>
                </div>

                {/* DIALOG */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg">Schedule Meeting</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
                        <DialogHeader>
                            <DialogTitle>Schedule Meeting</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {/* INTERVIEW TITLE */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Title</label>
                                <Input
                                    placeholder="Meeting title"
                                    name="title"
                                    className="bg-[#2a2a3a] border-[#313244] text-white"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* INTERVIEW DESC */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Description</label>
                                <Textarea
                                    name="description"
                                    placeholder="Meeting description"
                                    className="bg-[#2a2a3a] border-[#313244] text-white"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {/* CANDIDATE */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Attendees</label>
                                <Select
                                    value={formData.candidateId}
                                    onValueChange={(candidateId) =>
                                        setFormData({ ...formData, candidateId })
                                    }
                                >
                                    <SelectTrigger className="bg-[#2a2a3a] border-[#313244] text-white w-full">
                                        <SelectValue placeholder="Select candidate" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#2a2a3a] border-[#313244] text-white max-h-60 overflow-y-auto">
                                        {candidates.map((candidate) => (
                                            <SelectItem
                                                key={candidate.tokenIdentifier}
                                                value={candidate.tokenIdentifier}
                                                className="hover:bg-[#3a3a4a] text-white"
                                            >
                                                <UserInfo user={candidate} />
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* INTERVIEWERS */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Interviewers</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedInterviewers.map((interviewer) => (
                                        <div
                                            key={interviewer.tokenIdentifier}
                                            className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                                        >
                                            <UserInfo user={interviewer} />
                                            {interviewer.tokenIdentifier !== user?.id && (
                                                <button
                                                    onClick={() => removeInterviewer(interviewer.tokenIdentifier)}
                                                    className="hover:text-destructive transition-colors"
                                                    aria-label={`Remove ${interviewer.name || 'interviewer'}`}
                                                >
                                                    <XIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {availableInterviewers.length > 0 && (
                                    <Select onValueChange={addInterviewer}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Add interviewer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableInterviewers.map((interviewer) => (
                                                <SelectItem key={interviewer.tokenIdentifier} value={interviewer.tokenIdentifier}>
                                                    <UserInfo user={interviewer} />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* DATE & TIME */}
                            {/* CALENDAR */}
                            <div className="space-y-2 w-full">
                                <label className="text-sm font-medium text-gray-300">Date</label>
                                <Calendar
                                    mode="single"
                                    selected={formData.date}
                                    onSelect={(date) => date && setFormData({ ...formData, date })}
                                    disabled={(date) => date < new Date()}
                                    className={cn(
                                        'w-full rounded-md border border-[#313244] bg-[#2a2a3a] text-gray-100 p-3',
                                    )}
                                    classNames={{
                                        months: 'w-full flex flex-col',
                                        month: 'w-full space-y-4',
                                        table: 'w-full border-collapse',
                                        tbody: 'w-full',
                                        row: 'w-full flex mt-2',
                                        cell: cn('flex-1 text-center p-0 m-0.5', 'min-w-0'),
                                        day: cn(
                                            'w-full h-9 flex items-center justify-center text-sm p-1',
                                            'text-gray-100 hover:bg-[#3a3a4a] rounded',
                                            'aria-selected:bg-[#4a4a5a] aria-selected:text-white',
                                            'disabled:text-gray-500 disabled:opacity-50',
                                        ),
                                        head_row: 'w-full flex',
                                        head_cell: cn('flex-1 text-center text-muted-foreground text-[0.8rem] font-normal m-0.5'),
                                        day_range_start: 'rounded-l bg-[#4a4a5a] text-white',
                                        day_range_end: 'rounded-r bg-[#4a4a5a] text-white',
                                        day_range_middle: 'bg-[#3a3a4a] text-gray-100',
                                    }}
                                />
                            </div>
                            {/* TIME */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Time</label>
                                <Select
                                    value={formData.time}
                                    onValueChange={(time) => setFormData({ ...formData, time })}
                                >
                                    <SelectTrigger className="bg-[#2a2a3a] border-[#313244] text-white w-full">
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#2a2a3a] border-[#313244] text-white max-h-60 overflow-y-auto">
                                        {TIME_SLOTS.map((time) => (
                                            <SelectItem
                                                key={time}
                                                value={time}
                                                className="hover:bg-[#3a3a4a] text-white"
                                            >
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={scheduleMeeting} disabled={isCreating}>
                                    {isCreating ? (
                                        <>
                                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                                            Scheduling...
                                        </>
                                    ) : (
                                        "Schedule Interview"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* SEARCH BAR AND TOGGLE BUTTON */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by title or description"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#2a2a3a] border-[#313244] text-white"
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsColumnLayout(!isColumnLayout)}
                    aria-label={isColumnLayout ? "Switch to row layout" : "Switch to column layout"}
                >
                    {isColumnLayout ? (
                        <LayoutGridIcon className="h-4 w-4" />
                    ) : (
                        <LayoutListIcon className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* LOADING STATE & MEETING CARDS */}
            {!interviews ? (
                <div className="flex justify-center py-12">
                    <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
                </div>
            ) : sortedInterviews.length > 0 ? (
                <div className="space-y-4">
                    <div className={cn(
                        "grid gap-6",
                        isColumnLayout ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
                    )}>
                        {sortedInterviews.map((interview) => (
                            <MeetingCard key={interview._id} interview={interview} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    {searchQuery ? "No interviews match your search" : "No interviews scheduled"}
                </div>
            )}
        </div>
    );
}
export default InterviewScheduleUI;