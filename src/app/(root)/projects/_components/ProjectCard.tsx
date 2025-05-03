import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useMutation } from "convex/react";
import toast from "react-hot-toast";
import { PencilIcon, TrashIcon, Loader2Icon } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

interface ProjectCardProps {
  project: {
    _id: Id<"projects">;
    userId: Id<"users">;
    name: string;
    url: string;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [newUrl, setNewUrl] = useState(project.url);



  return (
    <div className="p-4 bg-[#2a2a3a] border border-[#313244] rounded-lg flex flex-col gap-4">
      
      {/* Website Preview */}
      <div className="aspect-video overflow-hidden rounded-md border border-gray-700 group">
        <iframe
          src={project.url}
          title={project.name}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          className="w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Project Info */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {editMode ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-[#3a3a4a] text-white rounded-md px-2 py-1 w-full mb-2"
                placeholder="Project name"
              />
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="bg-[#3a3a4a] text-white rounded-md px-2 py-1 w-full"
                placeholder="Project URL"
              />
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-white truncate">{project.name}</h3>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline break-all"
              >
                {project.url}
              </a>
            </>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default ProjectCard;
