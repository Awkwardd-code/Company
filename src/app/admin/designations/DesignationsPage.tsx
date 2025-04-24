// app/dashboard/settings/designations/page.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";

export default function DesignationsPage() {
  const designations = useQuery(api.designations.getDesignations) ?? [];
  const addDesignation = useMutation(api.designations.addDesignation);
  const updateDesignation = useMutation(api.designations.updateDesignation);
  const deleteDesignation = useMutation(api.designations.deleteDesignation);

  const [title, setTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [selectedId, setSelectedId] = useState<Id<"designations"> | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAdd = async () => {
    if (!title) return toast.error("Title is required");
    try {
      await addDesignation({ title });
      setTitle("");
      setAddOpen(false);
      toast.success("Designation added");
    } catch {
      toast.error("Failed to add");
    }
  };

  const handleEdit = async () => {
    if (!selectedId || !editTitle) return toast.error("Missing data");
    try {
      await updateDesignation({ designationId: selectedId, title: editTitle });
      setEditOpen(false);
      setSelectedId(null);
      setEditTitle("");
      toast.success("Designation updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteDesignation({ designationId: selectedId });
      setDeleteOpen(false);
      setSelectedId(null);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (!designations) {
    return (
      <div className="flex justify-center py-12">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Designations</h1>
          <p className="text-muted-foreground mt-1">Manage available professional roles</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Add Designation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Designation</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Title"
              className="bg-[#2a2a3a] border-[#313244] text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleAdd}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {designations.length > 0 ? (
        <ul className="space-y-4">
          {designations.map((d) => (
            <li
              key={d._id}
              className="flex items-center justify-between bg-[#1d1d2e] border border-[#313244] rounded-lg px-4 py-3"
            >
              <span className="text-white">{d.title}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedId(d._id);
                    setEditTitle(d.title);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedId(d._id);
                    setDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-center text-muted-foreground">No designations found.</p>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Designation</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="New title"
            className="bg-[#2a2a3a] border-[#313244] text-white"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Designation</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-300">Are you sure? This can't be undone.</p>
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
