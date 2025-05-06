"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
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
import {
    Loader2Icon,
    XIcon,
    SearchIcon,
    LayoutGridIcon,
    LayoutListIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel"; // Import Doc

// Use Doc<"interviews"> for type consistency
type Interview = Doc<"interviews">;

function InterviewScheduleUI() {
    const client = useStreamVideoClient();
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isColumnLayout, setIsColumnLayout] = useState(false);
    const me = useQuery(api.users.getMe);

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
    const filteredInterviews = interviews.filter(
        (interview) =>
            interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (interview.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    // Sort interviews: live meetings first, then by start time
    const sortedInterviews = [...filteredInterviews].sort((a, b) => {
        const now = Date.now();
        const DEFAULT_DURATION_MS = 60 * 60 * 1000; // 1 hour
        const aStart = a.startTime;
        const aEnd = a.endTime ?? aStart + DEFAULT_DURATION_MS;
        const bStart = b.startTime;
        const bEnd = b.endTime ?? bStart + DEFAULT_DURATION_MS;

        const aIsLive = now >= aStart && now <= aEnd;
        const bIsLive = now >= bStart && now <= bEnd;

        if (aIsLive && !bIsLive) return -1; // a is live, b is not
        if (!aIsLive && bIsLive) return 1; // b is live, a is not
        return aStart - bStart; // Sort by start time for non-live meetings
    });

    return (
        <div className="container max-w-7xl mx-auto p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="flex items-center justify-between">
                {/* HEADER INFO */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Meetings
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Schedule and manage your interviews with ease
                    </p>
                </div>

                {/* DIALOG */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                        >
                            Schedule Meeting
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Schedule Meeting
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                            {/* INTERVIEW TITLE */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Title
                                </label>
                                <Input
                                    placeholder="Enter meeting title"
                                    name="title"
                                    className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* INTERVIEW DESC */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <Textarea
                                    name="description"
                                    placeholder="Enter meeting description"
                                    className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            {/* CANDIDATE */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Client
                                </label>
                                <Select
                                    value={formData.candidateId}
                                    onValueChange={(candidateId) =>
                                        setFormData({ ...formData, candidateId })
                                    }
                                >
                                    <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                                        <SelectValue placeholder="Select Client" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white max-h-60 overflow-y-auto">
                                        {candidates.map((candidate) => (
                                            <SelectItem
                                                key={candidate.tokenIdentifier}
                                                value={candidate.tokenIdentifier}
                                                className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-150"
                                            >
                                                <UserInfo user={candidate} />
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* INTERVIEWERS */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Programmers
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedInterviewers.map((interviewer) => (
                                        <div
                                            key={interviewer.tokenIdentifier}
                                            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full text-sm text-blue-800 dark:text-blue-200"
                                        >
                                            <UserInfo user={interviewer} />
                                            {interviewer.tokenIdentifier !== user?.id && (
                                                <button
                                                    onClick={() => removeInterviewer(interviewer.tokenIdentifier)}
                                                    className="hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150"
                                                    aria-label={`Remove ${interviewer.name || "interviewer"}`}
                                                >
                                                    <XIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {availableInterviewers.length > 0 && (
                                    <Select onValueChange={addInterviewer}>
                                        <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                                            <SelectValue placeholder="Add Programmer" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                            {availableInterviewers.map((interviewer) => (
                                                <SelectItem
                                                    key={interviewer.tokenIdentifier}
                                                    value={interviewer.tokenIdentifier}
                                                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                                                >
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
                                        "w-full rounded-md border border-[#313244] bg-[#2a2a3a] text-gray-100 p-3"
                                    )}
                                    classNames={{
                                        months: "w-full flex flex-col",
                                        month: "w-full space-y-4",
                                        table: "w-full border-collapse",
                                        tbody: "w-full",
                                        row: "w-full flex mt-2",
                                        cell: cn("flex-1 text-center p-0 m-0.5", "min-w-0"),
                                        day: cn(
                                            "w-full h-9 flex items-center justify-center text-sm p-1",
                                            "text-gray-100 hover:bg-[#3a3a4a] rounded",
                                            "aria-selected:bg-[#4a4a5a] aria-selected:text-white",
                                            "disabled:text-gray-500 disabled:opacity-50"
                                        ),
                                        head_row: "w-full flex",
                                        head_cell: cn(
                                            "flex-1 text-center text-muted-foreground text-[0.8rem] font-normal m-0.5"
                                        ),
                                        day_range_start: "rounded-l bg-[#4a4a5a] text-white",
                                        day_range_end: "rounded-r bg-[#4a4a5a] text-white",
                                        day_range_middle: "bg-[#3a3a4a] text-gray-100",
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
                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={scheduleMeeting}
                                    disabled={isCreating}
                                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                                            Scheduling...
                                        </>
                                    ) : (
                                        "Schedule Meeting"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* SEARCH BAR AND TOGGLE BUTTON */}
            <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md w-full">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <Input
                        placeholder="Search by title or description"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg transition-all duration-200"
                    />
                </div>

                {/* Toggle Button */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsColumnLayout(!isColumnLayout)}
                    aria-label={isColumnLayout ? "Switch to grid layout" : "Switch to list layout"}
                    className="border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                >
                    {isColumnLayout ? (
                        <LayoutGridIcon className="h-5 w-5" />
                    ) : (
                        <LayoutListIcon className="h-5 w-5" />
                    )}
                </Button>
            </div>


            {/* LOADING STATE & MEETING CARDS */}
            {!interviews ? (
                <div className="flex justify-center py-16">
                    <Loader2Icon className="size-10 animate-spin text-gray-400" />
                </div>
            ) : sortedInterviews.length > 0 ? (
                <div className="space-y-6">
                    <div
                        className={cn(
                            "grid gap-6",
                            isColumnLayout ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
                        )}
                    >
                        {sortedInterviews.map((interview) => (
                            <div
                                key={interview._id}
                                className="transform transition-all duration-300 hover:scale-105"
                            >
                                <MeetingCard interview={interview} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-lg">
                    {searchQuery ? "No interviews match your search" : "No interviews scheduled"}
                </div>
            )}
        </div>
    );
}

export default InterviewScheduleUI;