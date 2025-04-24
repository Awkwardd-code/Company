import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2Icon } from "lucide-react";

function ProfessionalsUI() {
  const professionals = useQuery(api.professionals.getProfessionals) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const designations = useQuery(api.designations.getDesignations) ?? [];


  const addProfessional = useMutation(api.professionals.addProfessional);
  const updateProfessional = useMutation(api.professionals.updateProfessional);
  const removeProfessional = useMutation(api.professionals.deleteProfessional);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<Id<"professionals"> | null>(null);

  const [formData, setFormData] = useState({
    userId: "",
    bio: "",
    designations: [] as Id<"designations">[],
  });

  const [editFormData, setEditFormData] = useState({
    userId: "",
    bio: "",
    designations: [] as Id<"designations">[],
  });

  const handleAddProfessional = async () => {
    if (!formData.userId || !formData.bio || formData.designations.length === 0) {
      toast.error("User, bio, and designations are required.");
      return;
    }

    try {
      await addProfessional({
        bio: formData.bio,
        userId: formData.userId as Id<"users">,
        designations: formData.designations,
      });
      setAddOpen(false);
      setFormData({ userId: "", bio: "", designations: [] });
      toast.success("Professional added successfully.");
    } catch (e) {
      toast.error("Failed to add professional.");
    }
  };

  const handleUpdateProfessional = async () => {
    if (!selectedProfessionalId || !editFormData.bio || editFormData.designations.length === 0) {
      toast.error("Please provide bio and designations.");
      return;
    }

    try {
      await updateProfessional({
        professionalId: selectedProfessionalId,
        bio: editFormData.bio,
        designations: editFormData.designations,
      });
      setEditOpen(false);
      setEditFormData({ userId: "", bio: "", designations: [] });
      setSelectedProfessionalId(null);
      toast.success("Professional updated successfully.");
    } catch (e) {
      toast.error("Failed to update professional.");
    }
  };

  const handleRemoveProfessional = async () => {
    if (!selectedProfessionalId) return;

    try {
      await removeProfessional({ professionalId: selectedProfessionalId });
      setDeleteOpen(false);
      toast.success("Professional removed successfully.");
      setSelectedProfessionalId(null);
    } catch (e) {
      toast.error("Failed to remove professional.");
    }
  };

  const handleEditClick = (professional: typeof professionals[0]) => {
    setEditFormData({
      userId: professional.userId,
      bio: professional.bio,
      designations: professional.designations,
    });
    setSelectedProfessionalId(professional._id);
    setEditOpen(true);
  };

  const handleDesignationChange = (designationId: Id<"designations">, checked: boolean, isEdit: boolean = false) => {
    const setData = isEdit ? setEditFormData : setFormData;
    setData((prev) => ({
      ...prev,
      designations: checked
        ? [...prev.designations, designationId]
        : prev.designations.filter((id) => id !== designationId),
    }));
  };

  if (!professionals || !users || !designations) {
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
          <h1 className="text-3xl font-bold">Professionals</h1>
          <p className="text-muted-foreground mt-1">Manage professionals and their designations</p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Add Professional</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Add Professional</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">User</label>
                <Select
                  value={formData.userId}
                  onValueChange={(userId) => setFormData({ ...formData, userId })}
                >
                  <SelectTrigger className="bg-[#2a2a3a] border-[#313244] text-white w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a3a] border-[#313244] text-white max-h-60 overflow-y-auto">
                    {users.map((u) => (
                      <SelectItem
                        key={u._id}
                        value={u._id}
                        className="hover:bg-[#3a3a4a] text-white"
                      >
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Bio</label>
                <Textarea
                  placeholder="Enter bio"
                  className="bg-[#2a2a3a] border-[#313244] text-white"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Designations</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {designations.map((d) => (
                    <div key={d._id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.designations.includes(d._id)}
                        onCheckedChange={(checked) =>
                          handleDesignationChange(d._id, checked as boolean)
                        }
                      />
                      <span className="text-white">{d.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProfessional}>
                  Add Professional
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Professional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">User</label>
              <Input
                value={users.find((u) => u._id === editFormData.userId)?.name || ""}
                disabled
                className="bg-[#2a2a3a] border-[#313244] text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Bio</label>
              <Textarea
                placeholder="Edit bio"
                className="bg-[#2a2a3a] border-[#313244] text-white"
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Designations</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {designations.map((d) => (
                  <div key={d._id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={editFormData.designations.includes(d._id)}
                      onCheckedChange={(checked) =>
                        handleDesignationChange(d._id, checked as boolean, true)
                      }
                    />
                    <span className="text-white">{d.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProfessional}>
                Update Professional
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Professional</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-300">
              Are you sure you want to remove this professional? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveProfessional}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Professionals List */}
      {professionals.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((professional) => {
              const user = users.find((u) => u._id === professional.userId);
              const professionalDesignations = designations.filter((d) =>
                professional.designations.includes(d._id)
              );
              return (
                <div
                  key={professional._id}
                  className="bg-[#1d1d2e] border border-[#313244] rounded-lg p-6 space-y-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                    <p className="text-sm text-gray-400">{professional.bio}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Designations</h4>
                    <ul className="space-y-1">
                      {professionalDesignations.map((d) => (
                        <li key={d._id} className="text-sm text-white">
                          {d.title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleEditClick(professional)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedProfessionalId(professional._id);
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">No professionals found.</p>
      )}
    </div>
  );
}

export default ProfessionalsUI;
