import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";
import { PencilIcon, TrashIcon, Loader2Icon } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject({ id: project._id });
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateProject({ id: project._id, name: newName, url: newUrl });
      toast.success("Project updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project.");
    } finally {
      setIsUpdating(false);
    }
  };

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

        <div className="flex flex-col items-center space-y-2 ml-4">
          {editMode ? (
            <Button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700"
              size="icon"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 hover:bg-yellow-600"
              size="icon"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            size="icon"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
