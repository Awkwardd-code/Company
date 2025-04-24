import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { addHours, intervalToDuration, isAfter, isBefore, isWithinInterval } from "date-fns";
import { Doc } from "../../convex/_generated/dataModel";



export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date_ms: number) {
	// Convert milliseconds to seconds
	let date_seconds = date_ms / 1000;

	// Convert to Date object
	let date_obj = new Date(date_seconds * 1000);

	// Get current date and time
	let current_date = new Date();
	current_date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
	let current_time = current_date.getTime();

	// Get the date part of the provided date
	let provided_date = new Date(date_obj);
	provided_date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

	// Check if it's today
	if (provided_date.getTime() === current_time) {
		return date_obj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
	}

	// Check if it's yesterday
	let yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	yesterday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
	if (provided_date.getTime() === yesterday.getTime()) {
		return "Yesterday";
	}

	// Check if it's a different day of the week
	if (provided_date.getDay() < current_date.getDay()) {
		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		return days[provided_date.getDay()];
	}

	// If none of the above conditions match, return in a different format
	return provided_date.getMonth() + 1 + "/" + provided_date.getDate() + "/" + provided_date.getFullYear();
}

export const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
	const date1 = new Date(timestamp1);
	const date2 = new Date(timestamp2);
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

// Define getRelativeDateTime function
export const getRelativeDateTime = (message: any, previousMessage: any) => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const lastWeek = new Date(today);
	lastWeek.setDate(lastWeek.getDate() - 7);

	const messageDate = new Date(message._creationTime);

	if (!previousMessage || !isSameDay(previousMessage._creationTime, messageDate.getTime())) {
		if (isSameDay(messageDate.getTime(), today.getTime())) {
			return "Today";
		} else if (isSameDay(messageDate.getTime(), yesterday.getTime())) {
			return "Yesterday";
		} else if (messageDate.getTime() > lastWeek.getTime()) {
			const options: Intl.DateTimeFormatOptions = {
				weekday: "long",
			};
			return messageDate.toLocaleDateString(undefined, options);
		} else {
			const options: Intl.DateTimeFormatOptions = {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			};
			return messageDate.toLocaleDateString(undefined, options);
		}
	}
};

export function randomID(len: number) {
	let result = "";
	if (result) return result;
	var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
		maxPos = chars.length,
		i;
	len = len || 5;
	for (i = 0; i < len; i++) {
		result += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return result;
}






type Interview = Doc<"interviews">;
type User = Doc<"users">;

export const groupInterviews = (interviews: Interview[]) => {
	if (!interviews) return {};

	return interviews.reduce((acc: any, interview: Interview) => {
		const date = new Date(interview.startTime);
		const now = new Date();

		if (interview.status === "succeeded") {
			acc.succeeded = [...(acc.succeeded || []), interview];
		} else if (interview.status === "failed") {
			acc.failed = [...(acc.failed || []), interview];
		} else if (isBefore(date, now)) {
			acc.completed = [...(acc.completed || []), interview];
		} else if (isAfter(date, now)) {
			acc.upcoming = [...(acc.upcoming || []), interview];
		}

		return acc;
	}, {});
};

export const getCandidateInfo = (users: User[], candidateId: string) => {
	const candidate = users?.find((user) => user.tokenIdentifier === candidateId);
	return {
		name: candidate?.name || "Unknown Candidate",
		image: candidate?.image || "",
		initials:
			candidate?.name
				?.split(" ")
				.map((n) => n[0])
				.join("") || "UC",
	};
};

export const getInterviewerInfo = (users: User[], interviewerId: string) => {
	const interviewer = users?.find((user) => user.tokenIdentifier === interviewerId);
	return {
		name: interviewer?.name || "Unknown Interviewer",
		image: interviewer?.image,
		initials:
			interviewer?.name
				?.split(" ")
				.map((n) => n[0])
				.join("") || "UI",
	};
};

export const calculateRecordingDuration = (startTime: string, endTime: string) => {
	const start = new Date(startTime);
	const end = new Date(endTime);

	const duration = intervalToDuration({ start, end });

	if (duration.hours && duration.hours > 0) {
		return `${duration.hours}:${String(duration.minutes).padStart(2, "0")}:${String(
			duration.seconds
		).padStart(2, "0")}`;
	}

	if (duration.minutes && duration.minutes > 0) {
		return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
	}

	return `${duration.seconds} seconds`;
};

export const getMeetingStatus = (interview: Interview) => {
	const now = new Date();
	const interviewStartTime = interview.startTime;
	const endTime = addHours(interviewStartTime, 1);

	if (
		interview.status === "completed" ||
		interview.status === "failed" ||
		interview.status === "succeeded"
	)
		return "completed";
	if (isWithinInterval(now, { start: interviewStartTime, end: endTime })) return "live";
	if (isBefore(now, interviewStartTime)) return "upcoming";
	return "completed";
};