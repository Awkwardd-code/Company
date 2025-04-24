import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();
  const status = getMeetingStatus(interview);
  const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");

  const statusMap = {
    live: { label: "Live Now", variant: "default", color: "text-green-600" },
    upcoming: { label: "Upcoming", variant: "secondary", color: "text-blue-600" },
    completed: { label: "Completed", variant: "outline", color: "text-muted-foreground" },
  };

  return (
    <Card className="shadow-md border border-muted p-4 hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          <Badge variant={statusMap[status].variant} className={statusMap[status].color}>
            {statusMap[status].label}
          </Badge>
        </div>

        <CardTitle className="text-lg font-semibold leading-tight">
          {interview.title}
        </CardTitle>

        {interview.description && (
          <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
            {interview.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {status === "live" && (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white transition"
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant="outline" className="w-full" disabled>
            Waiting to Start
          </Button>
        )}

        {status === "completed" && (
          <Button variant="ghost" className="w-full text-muted-foreground cursor-default" disabled>
            Meeting Ended
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default MeetingCard;
