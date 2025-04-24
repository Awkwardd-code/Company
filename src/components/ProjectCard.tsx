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
    <div className="p-4 bg-[#2a2a3a] border border-[#313244] rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          {editMode ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-[#3a3a4a] text-white rounded-md px-2 py-1"
            />
          ) : (
            <h3 className="text-lg font-semibold text-white">{project.name}</h3>
          )}
          {editMode ? (
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="bg-[#3a3a4a] text-white rounded-md px-2 py-1 mt-2"
            />
          ) : (
            <p className="text-sm text-gray-300 mt-2">{project.url}</p>
          )}
        </div>
        <div className="flex space-x-3">
          {editMode ? (
            <Button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save"
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
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