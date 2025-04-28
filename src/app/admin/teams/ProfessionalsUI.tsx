"use client";

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
import { Loader2Icon, UploadIcon } from "lucide-react";

function ProfessionalsUI() {
  const professionals = useQuery(api.professionals.get) ?? [];
  const programmers = useQuery(api.users.getProgrammers) ?? [];
  const designations = useQuery(api.designations.getDesignations) ?? [];
  const generateUploadUrl = useMutation(api.professionals.generateUploadUrl);

  const addProfessional = useMutation(api.professionals.add);
  const updateProfessional = useMutation(api.professionals.update);
  const removeProfessional = useMutation(api.professionals.remove);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<Id<"professionals"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    userId: "" as string | Id<"users">,
    bio: "",
    image: "", // will hold the preview URL
    designations: [] as Id<"designations">[],
  });

  const [editFormData, setEditFormData] = useState({
    userId: "" as string | Id<"users">,
    bio: "",
    image: "", // will hold the preview URL
    designations: [] as Id<"designations">[],
  });

  // Handler for file input change (Add)
  const handleAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  // Handler for file input change (Edit)
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setEditImageFile(file);
      setEditFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleAddProfessional = async () => {
    if (!formData.userId) {
      toast.error("Please select a programmer");
      return;
    }
    if (!formData.bio.trim()) {
      toast.error("Bio is required");
      return;
    }
    if (!imageFile) {
      toast.error("Profile image is required");
      return;
    }
    if (formData.designations.length === 0) {
      toast.error("At least one designation is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload the image first
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });
      const { storageId } = await result.json();

      await addProfessional({
        bio: formData.bio.trim(),
        userId: formData.userId as Id<"users">,
        image: storageId,
        designations: formData.designations,
      });

      setAddOpen(false);
      setFormData({ userId: "", bio: "", image: "", designations: [] });
      setImageFile(null);
      toast.success("Professional added successfully");
    } catch (error) {
      toast.error("Failed to add professional");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfessional = async () => {
    if (!selectedProfessionalId) {
      toast.error("No professional selected");
      return;
    }
    if (!editFormData.bio.trim()) {
      toast.error("Bio is required");
      return;
    }
    if (editFormData.designations.length === 0) {
      toast.error("At least one designation is required");
      return;
    }

    setIsSubmitting(true);
    try {
      let storageId: Id<"_storage"> | undefined;
      if (editImageFile) {
        // Upload new image if changed
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": editImageFile.type },
          body: editImageFile,
        });
        const json = await result.json();
        storageId = json.storageId;
      }

      await updateProfessional({
        id: selectedProfessionalId,
        bio: editFormData.bio.trim(),
        image: storageId || undefined, // Only update image if new one was uploaded
        designations: editFormData.designations,
      });

      setEditOpen(false);
      setEditFormData({ userId: "", bio: "", image: "", designations: [] });
      setEditImageFile(null);
      setSelectedProfessionalId(null);
      toast.success("Professional updated successfully");
    } catch (error) {
      toast.error("Failed to update professional");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveProfessional = async () => {
    if (!selectedProfessionalId) return;

    setIsSubmitting(true);
    try {
      await removeProfessional({ id: selectedProfessionalId });
      setDeleteOpen(false);
      toast.success("Professional removed successfully");
      setSelectedProfessionalId(null);
    } catch (error) {
      toast.error("Failed to remove professional");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (professional: typeof professionals[0]) => {
    setEditFormData({
      userId: professional.userId,
      bio: professional.bio,
      image: professional.image || "",
      designations: professional.designations,
    });
    setSelectedProfessionalId(professional._id);
    setEditOpen(true);
  };

  const handleDesignationChange = (
    designationId: Id<"designations">,
    checked: boolean,
    isEdit: boolean = false
  ) => {
    const setData = isEdit ? setEditFormData : setFormData;
    setData((prev) => ({
      ...prev,
      designations: checked
        ? [...prev.designations, designationId]
        : prev.designations.filter((id) => id !== designationId),
    }));
  };

  if (!professionals || !programmers || !designations) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2Icon className="size-10 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Professionals</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your team of professionals</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Professional
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[550px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Add Professional</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Programmer*</label>
                <Select
                  value={formData.userId as string}
                  onValueChange={(userId) => setFormData({ ...formData, userId })}
                >
                  <SelectTrigger className="bg-[#2a2a3a] border-[#3a3a4a] text-white">
                    <SelectValue placeholder="Select programmer" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a3a] border-[#3a3a4a] text-white">
                    {programmers.map((u) => (
                      <SelectItem key={u._id} value={u._id} className="hover:bg-[#3a3a4a]">
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Bio*</label>
                <Textarea
                  placeholder="Professional bio"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white min-h-[150px]"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Profile Image*</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImageChange}
                    className="hidden"
                    id="add-image-upload"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="add-image-upload"
                    className={`flex items-center gap-2 w-full bg-[#2a2a3a] border border-[#3a3a4a] p-3 rounded-md text-white cursor-pointer hover:bg-[#3a3a4a] transition-colors ${isSubmitting ? 'opacity-50' : ''}`}
                  >
                    <UploadIcon className="size-5 text-gray-400" />
                    <span className="text-sm">Choose Image</span>
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-3 w-full h-48 bg-[#2a2a3a] rounded-md border border-[#3a3a4a] flex items-center justify-center overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Designations*</label>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {designations.map((d) => (
                    <div key={d._id} className="flex items-center gap-3">
                      <Checkbox
                        checked={formData.designations.includes(d._id)}
                        onCheckedChange={(checked) => handleDesignationChange(d._id, checked as boolean)}
                        className="border-[#3a3a4a] data-[state=checked]:bg-indigo-600"
                      />
                      <span className="text-sm text-white">{d.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                  className="border-[#3a3a4a] text-white hover:bg-[#3a3a4a]"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProfessional}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2Icon className="size-5 animate-spin mr-2" />}
                  Add Professional
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[550px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Edit Professional</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Programmer</label>
              <Input
                value={programmers.find(u => u._id === editFormData.userId)?.name || "Unknown Programmer"}
                disabled
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Bio*</label>
              <Textarea
                placeholder="Professional bio"
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white min-h-[150px]"
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Profile Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="hidden"
                  id="edit-image-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="edit-image-upload"
                  className={`flex items-center gap-2 w-full bg-[#2a2a3a] border border-[#3a3a4a] p-3 rounded-md text-white cursor-pointer hover:bg-[#3a3a4a] transition-colors ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  <UploadIcon className="size-5 text-gray-400" />
                  <span className="text-sm">Change Image</span>
                </label>
              </div>
              {editFormData.image && (
                <div className="mt-3 w-full h-48 bg-[#2a2a3a] rounded-md border border-[#3a3a4a] flex items-center justify-center overflow-hidden">
                  <img
                    src={editFormData.image}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Designations*</label>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {designations.map((d) => (
                  <div key={d._id} className="flex items-center gap-3">
                    <Checkbox
                      checked={editFormData.designations.includes(d._id)}
                      onCheckedChange={(checked) => handleDesignationChange(d._id, checked as boolean, true)}
                      className="border-[#3a3a4a] data-[state=checked]:bg-indigo-600"
                    />
                    <span className="text-sm text-white">{d.title}</span>
                  </div>
                ))}
              </div>
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
                onClick={handleUpdateProfessional}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2Icon className="size-5 animate-spin mr-2" />}
                Update Professional
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[450px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Delete Professional</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-300">
              Are you sure you want to delete this professional? This action cannot be undone.
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
              onClick={handleRemoveProfessional}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2Icon className="size-5 animate-spin mr-2" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Professionals List */}
      {professionals.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.map((professional) => {
            const programmer = programmers.find((u) => u._id === professional.userId);
            const professionalDesignations = designations.filter((d) =>
              professional.designations.includes(d._id)
            );
            return (
              <div
                key={professional._id}
                className="bg-gradient-to-br from-[#1d1d2e] to-[#24243e] border border-[#2c2c40] rounded-2xl p-6 space-y-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              >
                {professional.image && (
                  <div className="w-full h-48 bg-[#2a2a3a] rounded-xl overflow-hidden border border-[#3a3a4a] shadow-inner">
                    <img
                      src={professional.image}
                      alt={`${programmer?.name || "Professional"}'s profile`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{programmer?.name || "Unknown Professional"}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3">{professional.bio}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300">Designations</h4>
                  <div className="flex flex-wrap gap-2">
                    {professionalDesignations.map((d) => (
                      <span
                        key={d._id}
                        className="text-xs text-white bg-[#2a2a3a] border border-[#3a3a4a] rounded-full px-3 py-1"
                      >
                        {d.title}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleEditClick(professional)}
                    className="border-[#3a3a4a] text-white hover:bg-[#2f2f45] transition-all duration-300"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedProfessionalId(professional._id);
                      setDeleteOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 transition-all duration-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-4xl text-gray-500 mb-4">📋</div>
          <p className="text-gray-400">No professionals found. Add a professional to get started.</p>
          <Button
            onClick={() => setAddOpen(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300"
          >
            Create Your First Professional
          </Button>
        </div>
      )}

    </div>
  );
}

export default ProfessionalsUI;