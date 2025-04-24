import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { Id } from "../../../../convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  userId: Id<"users">;
  name: string;
  url: string;
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
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch projects and users
  const projects = useQuery(api.projects.getProjects) as Project[] | undefined;
  const users = useQuery(api.users.getUsers) as User[] | undefined;
  const syncUser = useMutation(api.users.syncUser);

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

  const createProject = useMutation(api.projects.createProject);

  // Initialize formData with undefined userId until convexUserId is available
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    userId: convexUserId,
  });

  // Update formData.userId when convexUserId changes
  useEffect(() => {
    if (convexUserId) {
      setFormData((prev) => ({ ...prev, userId: convexUserId }));
    }
  }, [convexUserId]);

  const addProject = async () => {
    if (!user || !convexUserId || !formData.userId) {
      toast.error("User not authenticated.");
      return;
    }

    setIsCreating(true);

    try {
      const { name, url, userId } = formData;

      if (!name || !url || !userId) {
        toast.error("All fields are required.");
        return;
      }

      await createProject({
        name,
        url,
        userId,
      });

      setOpen(false);
      toast.success("Project created successfully!");

      setFormData({
        name: "",
        url: "",
        userId: convexUserId,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!projects || !users || !convexUserId) {
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" disabled={!convexUserId}>
              Create Project
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Project Name</label>
                <Input
                  placeholder="Project name"
                  name="name"
                  className="bg-[#2a2a3a] border-[#313244] text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Project URL</label>
                <Input
                  placeholder="Project URL"
                  name="url"
                  className="bg-[#2a2a3a] border-[#313244] text-white"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Project Owner</label>
                <Select
                  value={formData.userId ?? ""}
                  onValueChange={(userId) => setFormData({ ...formData, userId: userId as Id<"users"> })}
                >
                  <SelectTrigger className="bg-[#2a2a3a] border-[#313244] text-white w-full">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a3a] border-[#313244] text-white max-h-60 overflow-y-auto">
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        <UserInfo user={user} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addProject} disabled={isCreating || !convexUserId}>
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

      {projects.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No projects created</div>
      )}
    </div>
  );
}

export default ProjectsUI;