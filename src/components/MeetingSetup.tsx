import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Card } from "./ui/card";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
    const [isCameraDisabled, setIsCameraDisabled] = useState(true);
    const [isMicDisabled, setIsMicDisabled] = useState(false);

    const call = useCall();

    if (!call) return null;

    useEffect(() => {
        if (isCameraDisabled) call.camera.disable();
        else call.camera.enable();
    }, [isCameraDisabled, call.camera]);

    useEffect(() => {
        if (isMicDisabled) call.microphone.disable();
        else call.microphone.enable();
    }, [isMicDisabled, call.microphone]);

    const handleJoin = async () => {
        await call.join();
        onSetupComplete();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background/95">
            <div className="w-full max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* VIDEO PREVIEW CONTAINER */}
                    <Card className="md:col-span-1 p-3 sm:p-4  lg:p-6 flex flex-col">
                        <div>
                            <h1 className="text-base sm:text-lg lg:text-xl font-semibold mb-0.5 sm:mb-1">Camera Preview</h1>
                            <p className="text-[0.65rem] sm:text-xs lg:text-sm text-muted-foreground">Make sure you look good!</p>
                        </div>

                        {/* VIDEO PREVIEW */}
                        <div className="mt-2 sm:mt-4 flex-1 max-h-[60vh] rounded-lg sm:rounded-xl overflow-hidden bg-muted/50 border relative aspect-video">
                            <div className="absolute inset-0">
                                <VideoPreview className="h-full w-full max-w-full max-h-full" />
                            </div>
                        </div>
                    </Card>

                    {/* CARD CONTROLS */}
                    <Card className="md:col-span-1 p-4 sm:p-6">
                        <div className="h-full flex flex-col">
                            {/* MEETING DETAILS */}
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold mb-1">Meeting Details</h2>
                                <p className="text-xs sm:text-sm text-muted-foreground break-all">{call.id}</p>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                                    {/* CAM CONTROL */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <CameraIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm sm:text-base">Camera</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground">
                                                    {isCameraDisabled ? "Off" : "On"}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!isCameraDisabled}
                                            onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                                        />
                                    </div>

                                    {/* MIC CONTROL */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <MicIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm sm:text-base">Microphone</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground">
                                                    {isMicDisabled ? "Off" : "On"}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!isMicDisabled}
                                            onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                                        />
                                    </div>

                                    {/* DEVICE SETTINGS */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm sm:text-base">Settings</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground">Configure devices</p>
                                            </div>
                                        </div>
                                        <DeviceSettings />
                                    </div>
                                </div>

                                {/* JOIN BUTTON */}
                                <div className="space-y-3 mt-6 sm:mt-8">
                                    <Button className="w-full" size="lg" onClick={handleJoin}>
                                        Join Meeting
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        Do not worry, our team is super friendly! We want you to succeed. 🎉
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default MeetingSetup;