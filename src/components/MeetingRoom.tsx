import {
    CallControls,
    CallingState,
    CallParticipantsList,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CodeEditor from "./CodeEditor";
// import EndCallButton from "./EndCallButton";

const MeetingRoom = () => {
    const router = useRouter();
    const [layoutMode, setLayoutMode] = useState<"grid" | "speaker">("speaker");
    const [showParticipants, setShowParticipants] = useState(false);
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) {
        return (
            <div className="h-96 flex items-center justify-center">
                <LoaderIcon className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-1px)]">
            <ResizablePanelGroup direction="horizontal">
                {/* LEFT PANEL: VIDEO SECTION */}
                <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
                    <div className="absolute inset-0">
                        {layoutMode === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

                        {showParticipants && (
                            <div className="absolute top-0 right-0 h-full w-[300px] bg-background/90 backdrop-blur-md z-10 border-l">
                                <CallParticipantsList onClose={() => setShowParticipants(false)} />
                            </div>
                        )}
                    </div>

                    {/* CONTROLS */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="flex items-center gap-3 flex-wrap justify-center px-4">
                            <CallControls onLeave={() => router.push("/")} />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="size-10">
                                        <LayoutListIcon className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setLayoutMode("grid")}>
                                        Grid View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setLayoutMode("speaker")}>
                                        Speaker View
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="outline"
                                size="icon"
                                className="size-10"
                                onClick={() => setShowParticipants(!showParticipants)}
                            >
                                <UsersIcon className="w-4 h-4" />
                            </Button>

                            {/* <EndCallButton /> */}
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* RIGHT PANEL: CODE EDITOR */}
                <ResizablePanel defaultSize={65} minSize={30}>
                    <CodeEditor />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default MeetingRoom;
