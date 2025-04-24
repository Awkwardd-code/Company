import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Notepad = () => {
  const [content, setContent] = useState("");

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 pb-2">
        <h2 className="text-lg font-semibold">📝 Notepad</h2>
      </div>

      <div className="flex-1">
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Start typing your notes..."
          className="h-full [&>.ql-container]:h-[calc(100%-42px)] [&_.ql-toolbar]:rounded-none [&_.ql-container]:rounded-none border-none"
          theme="snow"
        />
      </div>
    </div>
  );
};

export default Notepad;
