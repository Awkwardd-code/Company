import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import Notepad from "./Notepad";

function CodeEditor() {
    const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
    const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id);
    const [code, setCode] = useState(selectedQuestion.starterCode[language]);

    const handleQuestionChange = (questionId: string) => {
        const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
        setSelectedQuestion(question);
        setCode(question.starterCode[language]);
    };

    const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
        setLanguage(newLanguage);
        setCode(selectedQuestion.starterCode[newLanguage]);
    };

    return (
        <ResizablePanelGroup direction="vertical" className="min-h-[calc-100vh-4rem-1px]">
            {/* QUESTION SECTION */}
            <ResizablePanel>
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* HEADER */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                
                                <div className="flex items-center gap-3">
                                   

                                    <Select value={language} onValueChange={handleLanguageChange}>
                                        <SelectTrigger className="w-[150px]">
                                            {/* SELECT VALUE */}
                                            <SelectValue>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={`/${language}.png`}
                                                        alt={language}
                                                        className="w-5 h-5 object-contain"
                                                    />
                                                    {LANGUAGES.find((l) => l.id === language)?.name}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        {/* SELECT CONTENT */}
                                        <SelectContent>
                                            {LANGUAGES.map((lang) => (
                                                <SelectItem key={lang.id} value={lang.id}>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={`/${lang.id}.png`}
                                                            alt={lang.name}
                                                            className="w-5 h-5 object-contain"
                                                        />
                                                        {lang.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                           <Notepad/>
                        </div>
                    </div>
                    <ScrollBar />
                </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* CODE EDITOR */}
            <ResizablePanel defaultSize={60} maxSize={100}>
                <div className="h-full relative">
                    <Editor
                        height={"100%"}
                        defaultLanguage={language}
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 18,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            wordWrap: "on",
                            wrappingIndent: "indent",
                        }}
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
export default CodeEditor;