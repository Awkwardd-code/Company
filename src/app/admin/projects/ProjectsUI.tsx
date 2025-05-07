"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  userId: Id<"users">;
  name: string;
  url: string;
  coverImage?: string;
  createdAt: number;
  updatedAt?: number;
}

interface User {
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
  role: "client" | "user" | "programmer";
  tokenIdentifier: string;
  isOnline: boolean;
}

function ProjectsUI() {
  const { user } = useUser();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | null>(null);

  // Fetch projects and current user
  const projects = useQuery(api.projects.getProjects) as Project[] | undefined;
  const auther = useQuery(api.users.getMe);
  const syncUser = useMutation(api.users.syncUser);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.remove);

  // Sync Clerk user to Convex
  const [convexUserId, setConvexUserId] = useState<Id<"users"> | undefined>();
  useEffect(() => {
    if (user) {
      const sync = async () => {
        try {
          const userId = await syncUser({
            clerkUserId: user.id,
            name: user.fullName || "Unknown",
            email: user.primaryEmailAddress?.emailAddress || "",
            image: user.imageUrl,
          });
          setConvexUserId(userId);
        } catch (error) {
          console.error("Failed to sync user:", error);
          toast.error("Failed to sync user.");
        }
      };
      sync();
    }
  }, [user, syncUser]);

  // Initialize formData with current user's ID
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    coverImage: "" as string | undefined,
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    url: "",
    coverImage: "" as string | undefined,
  });

  // Update formData.userId when convexUserId changes
  useEffect(() => {
    if (convexUserId) {
      setFormData((prev) => ({ ...prev }));
      setEditFormData((prev) => ({ ...prev }));
    }
  }, [convexUserId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      if (isEdit) {
        setEditImageFile(file);
        setEditFormData((prev) => ({ ...prev, coverImage: imageUrl }));
      } else {
        setImageFile(file);
        setFormData((prev) => ({ ...prev, coverImage: imageUrl }));
      }
    }
  };

  const addProject = async () => {
    if (!user || !convexUserId) {
      toast.error("User not authenticated.");
      return;
    }

    setIsCreating(true);
    try {
      const { name, url } = formData;

      if (!name) {
        toast.error("Name is required.");
        return;
      }
      if (!url) {
        toast.error("URL is required.");
        return;
      }

      let storageId: Id<"_storage"> | undefined;
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId: id } = await result.json();
        storageId = id;
      }

      await createProject({
        name,
        url,
        coverImage: storageId,
        userId: convexUserId,
      });

      setAddOpen(false);
      toast.success("Project created successfully!");

      setFormData({
        name: "",
        url: "",
        coverImage: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProjectId) {
      toast.error("No project selected");
      return;
    }
    if (!editFormData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!editFormData.url.trim()) {
      toast.error("URL is required");
      return;
    }

    setIsSubmitting(true);
    try {
      let storageId: Id<"_storage"> | undefined;
      if (editImageFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": editImageFile.type },
          body: editImageFile,
        });
        const { storageId: id } = await result.json();
        storageId = id;
      }

      await updateProject({
        id: selectedProjectId,
        name: editFormData.name.trim(),
        url: editFormData.url.trim(),
        coverImage: storageId,
        userId: convexUserId!,
      });

      setEditOpen(false);
      setEditFormData({
        name: "",
        url: "",
        coverImage: "",
      });
      setEditImageFile(null);
      setSelectedProjectId(null);
      toast.success("Project updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveProject = async () => {
    if (!selectedProjectId) return;

    setIsSubmitting(true);
    try {
      await deleteProject({ id: selectedProjectId });
      setDeleteOpen(false);
      toast.success("Project removed successfully");
      setSelectedProjectId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditFormData({
      name: project.name,
      url: project.url,
      coverImage: project.coverImage || "",
    });
    setSelectedProjectId(project._id);
    setEditOpen(true);
  };

  if (!projects || !auther || !convexUserId) {
    return (
      <div className="flex justify-center py-12">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and view projects</p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={!convexUserId}
            >
              Create Project
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Create Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Project Name*</label>
                <Input
                  placeholder="Project name"
                  name="name"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Project URL*</label>
                <Input
                  placeholder="Project URL"
                  name="url"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Cover Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="project-image-upload"
                    disabled={isCreating}
                  />
                  <label
                    htmlFor="project-image-upload"
                    className={`flex items-center gap-2 w-full bg-[#2a2a3a] border border-[#3a3a4a] p-3 rounded-md text-white cursor-pointer hover:bg-[#3a3a4a] transition-colors ${
                      isCreating ? "opacity-50" : ""
                    }`}
                  >
                    <UploadIcon className="size-5 text-gray-400" />
                    <span className="text-sm">Choose Image</span>
                  </label>
                </div>
                {formData.coverImage && (
                  <div className="mt-3 w-full h-48 bg-[#2a2a3a] rounded-md border border-[#3a3a4a] flex items-center justify-center overflow-hidden">
                    <img
                      src={formData.coverImage}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Project Owner</label>
                <Input
                  value={auther?.name || "You"}
                  disabled
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                  className="border-[#3a3a4a] text-white hover:bg-[#3a3a4a]"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addProject}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Project Name*</label>
              <Input
                placeholder="Project name"
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Project URL*</label>
              <Input
                placeholder="Project URL"
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                value={editFormData.url}
                onChange={(e) => setEditFormData({ ...editFormData, url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Cover Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, true)}
                  className="hidden"
                  id="edit-project-image-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="edit-project-image-upload"
                  className={`flex items-center gap-2 w-full bg-[#2a2a3a] border border-[#3a3a4a] p-3 rounded-md text-white cursor-pointer hover:bg-[#3a3a4a] transition-colors ${
                    isSubmitting ? "opacity-50" : ""
                  }`}
                >
                  <UploadIcon className="size-5 text-gray-400" />
                  <span className="text-sm">Change Image</span>
                </label>
              </div>
              {editFormData.coverImage && (
                <div className="mt-3 w-full h-48 bg-[#2a2a3a] rounded-md border border-[#3a3a4a] flex items-center justify-center overflow-hidden">
                  <img
                    src={editFormData.coverImage}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Project Owner</label>
              <Input
                value={auther?.name || "You"}
                disabled
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="border-[#3a3a4a] text-white hover:bg-[#3a3a4a]"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Project"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[450px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Delete Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-300">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-[#3a3a4a] text-white hover:bg-[#3a3a4a]"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveProject}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {projects.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-[#1d1d2e] border border-[#2a2a3a] rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              {project.coverImage && (
                <div className="w-full h-48 bg-[#2a2a3a] rounded-md border border-[#3a3a4a] overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={`${project.name} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <p className="text-sm text-gray-400">{project.url}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-200">Owner</h4>
                <p className="text-sm text-white">{auther?.name || "Unknown"}</p>
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleEditClick(project)}
                  className="border-[#3a3a4a] text-white hover:bg-[#3a3a4a]"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedProjectId(project._id);
                    setDeleteOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects found. Add a project to get started.</p>
          <Button
            onClick={() => setAddOpen(true)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProjectsUI;