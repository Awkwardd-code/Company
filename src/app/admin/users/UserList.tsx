"use client";

import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";
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
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  _id: Id<"users">;
  tokenIdentifier: string;
  name: string;
  email: string;
  image?: string;
  isOnline: boolean;
  isAdmin: boolean;
  role: "client" | "user" | "programmer";
}

function UserList() {
  const users = useQuery(api.users.getUsers, {}) as User[] | undefined;
  const deleteUser = useMutation(api.users.deleteUser);
  const editUser = useMutation(api.users.editUser);

  const [editableUserId, setEditableUserId] = useState<Id<"users"> | null>(null);
  const [editableFields, setEditableFields] = useState({
    name: "",
    email: "",
    image: "",
    isAdmin: false,
    role: "user" as "client" | "user" | "programmer",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Id<"users"> | null>(null);

  const toggleEdit = (user: User) => {
    setEditableUserId(user._id);
    setEditableFields({
      name: user.name,
      email: user.email,
      image: user.image || "",
      isAdmin: user.isAdmin,
      role: user.role,
    });
  };

  const cancelEdit = () => {
    setEditableUserId(null);
    setEditableFields({ name: "", email: "", image: "", isAdmin: false, role: "user" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB.");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPEG or PNG images are allowed.");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setEditableFields((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const updateHandler = async (id: Id<"users">) => {
    if (!editableFields.name || !editableFields.email) {
      toast.error("Name and email are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editableFields.email)) {
      toast.error("Invalid email format.");
      return;
    }

    setIsUpdating(true);
    try {
      await editUser({
        id,
        name: editableFields.name,
        email: editableFields.email,
        image: editableFields.image || undefined,
        isAdmin: editableFields.isAdmin,
        role: editableFields.role,
      });
      setEditableUserId(null);
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error("Failed to update user.");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteHandler = async () => {
    if (!userToDelete) return;

    setIsUpdating(true);
    try {
      await deleteUser({ id: userToDelete });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete user.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isLoading = users === undefined;
  const isUsersAvailable = Array.isArray(users) && users.length > 0;

  return (
    <div className="bg-gray-900 min-h-screen py-6 px-4 sm:px-6">
      <div className="container max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
          Users Management
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2Icon className="size-10 animate-spin text-indigo-400" />
          </div>
        ) : !isUsersAvailable ? (
          <p className="text-center text-gray-400 py-12">No users found. Add a user to get started.</p>
        ) : (
          <div className="bg-[#1a1a2e] rounded-lg shadow-xl overflow-hidden">
            {/* Mobile View */}
            <div className="block sm:hidden space-y-6 p-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-[#2a2a3a] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {editableUserId === user._id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-200">Name</label>
                        <Input
                          value={editableFields.name}
                          onChange={(e) =>
                            setEditableFields({ ...editableFields, name: e.target.value })
                          }
                          className="w-full bg-[#3a3a4a] border-[#4a4a5a] text-white focus:ring-2 focus:ring-indigo-500"
                          placeholder="Edit Name"
                          aria-label="Edit user name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-200">Email</label>
                        <Input
                          value={editableFields.email}
                          onChange={(e) =>
                            setEditableFields({ ...editableFields, email: e.target.value })
                          }
                          className="w-full bg-[#3a3a4a] border-[#4a4a5a] text-white focus:ring-2 focus:ring-indigo-500"
                          placeholder="Edit Email"
                          aria-label="Edit user email"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-200">Profile Image</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id={`image-upload-${user._id}`}
                            aria-label="Upload profile image"
                          />
                          <label
                            htmlFor={`image-upload-${user._id}`}
                            className="flex items-center gap-2 w-full bg-[#3a3a4a] border border-[#4a4a5a] p-3 rounded-md text-white cursor-pointer hover:bg-[#4a4a5a] transition-colors"
                          >
                            <UploadIcon className="size-5 text-gray-400" />
                            <span className="text-sm">Choose Image</span>
                          </label>
                        </div>
                        {editableFields.image && (
                          <img
                            src={editableFields.image}
                            alt="Preview"
                            className="mt-3 w-full h-32 object-cover rounded-md border border-[#4a4a5a]"
                          />
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-200">Role</label>
                        <Select
                          value={editableFields.role}
                          onValueChange={(value) =>
                            setEditableFields({
                              ...editableFields,
                              role: value as "client" | "user" | "programmer",
                            })
                          }
                        >
                          <SelectTrigger
                            className="w-full bg-[#3a3a4a] border-[#4a4a5a] text-white focus:ring-2 focus:ring-indigo-500"
                            aria-label="Select user role"
                          >
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#3a1a2e] border-[#4a4a5a] text-white">
                            <SelectItem value="client" className="hover:bg-[#4a4a5a]">
                              Client
                            </SelectItem>
                            <SelectItem value="user" className="hover:bg-[#4a4a5a]">
                              User
                            </SelectItem>
                            <SelectItem value="programmer" className="hover:bg-[#4a4a5a]">
                              Programmer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={editableFields.isAdmin}
                          onCheckedChange={(checked) =>
                            setEditableFields({ ...editableFields, isAdmin: checked as boolean })
                          }
                          className="border-[#4a4a5a] data-[state=checked]:bg-indigo-600"
                          aria-label="Toggle admin status"
                        />
                        <span className="text-sm text-white">Is Admin</span>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button
                          onClick={() => updateHandler(user._id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          disabled={isUpdating}
                          aria-label="Save changes"
                        >
                          {isUpdating ? (
                            <Loader2Icon className="size-5 animate-spin mr-2" />
                          ) : (
                            <FaCheck className="mr-2" />
                          )}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={cancelEdit}
                          className="border-[#4a4a5a] text-white hover:bg-[#4a4a5a]"
                          aria-label="Cancel edit"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <p className="text-sm text-gray-400">Email: {user.email}</p>
                      <p className="text-sm text-gray-400">
                        Role: <span className="capitalize">{user.role}</span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Status:{" "}
                        {user.isAdmin ? (
                          <span className="text-green-500">Admin</span>
                        ) : (
                          <span className="text-red-500">Non-Admin</span>
                        )}
                      </p>
                      {user.image && (
                        <img
                          src={user.image}
                          alt={`${user.name}'s profile`}
                          className="w-24 h-24 object-cover rounded-full border border-[#4a4a5a]"
                        />
                      )}
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => toggleEdit(user)}
                          className="border-[#4a4a5a] text-white hover:bg-[#4a4a5a]"
                          aria-label={`Edit user ${user.name}`}
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </Button>
                        {!user.isAdmin && (
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setUserToDelete(user._id);
                              setDeleteDialogOpen(true);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                            aria-label={`Delete user ${user.name}`}
                          >
                            <FaTrash className="mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <table className="w-full border-collapse">
                <thead className="bg-[#2a2a3a] text-gray-200 text-sm">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Admin</th>
                    <th className="px-6 py-4 text-left">Image</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#1a1a2e] text-white">
                  {isUsersAvailable ? (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-[#2a2a3a] transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          {editableUserId === user._id ? (
                            <Input
                              value={editableFields.name}
                              onChange={(e) =>
                                setEditableFields({ ...editableFields, name: e.target.value })
                              }
                              className="w-full bg-[#3a3a4a] border-[#4a4a5a] text-white focus:ring-2 focus:ring-indigo-500"
                              aria-label="Edit user name"
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editableUserId === user._id ? (
                            <Input
                              value={editableFields.email}
                              onChange={(e) =>
                                setEditableFields({ ...editableFields, email: e.target.value })
                              }
                              className="w-full bg-[#3a3a4a] border-[#4a4a5a] text-white focus:ring-2 focus:ring-indigo-500"
                              aria-label="Edit user email"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editableUserId === user._id ? (
                            <Select
                              value={editableFields.role}
                              onValueChange={(value) =>
                                setEditableFields({
                                  ...editableFields,
                                  role: value as "client" | "user" | "programmer",
                                })
                              }
                            >
                              <SelectTrigger
                                className="w-full bg-[#3a3a4a] border-[#4a4a5a] text-white focus:ring-2 focus:ring-indigo-500"
                                aria-label="Select user role"
                              >
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#3a3a4a] border-[#4a4a5a] text-white">
                                <SelectItem value="client" className="hover:bg-[#4a4a5a]">
                                  Client
                                </SelectItem>
                                <SelectItem value="user" className="hover:bg-[#4a4a5a]">
                                  User
                                </SelectItem>
                                <SelectItem value="programmer" className="hover:bg-[#4a4a5a]">
                                  Programmer
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="capitalize">{user.role}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {editableUserId === user._id ? (
                            <Checkbox
                              checked={editableFields.isAdmin}
                              onCheckedChange={(checked) =>
                                setEditableFields({ ...editableFields, isAdmin: checked as boolean })
                              }
                              className="border-[#4a4a5a] data-[state=checked]:bg-indigo-600"
                              aria-label="Toggle admin status"
                            />
                          ) : user.isAdmin ? (
                            <FaCheck className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimes className="text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editableUserId === user._id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id={`image-upload-table-${user._id}`}
                                aria-label="Upload profile image"
                              />
                              <label
                                htmlFor={`image-upload-table-${user._id}`}
                                className="flex items-center gap-2 bg-[#3a3a4a] border border-[#4a4a5a] px-3 py-2 rounded-md text-white cursor-pointer hover:bg-[#4a4a5a] transition-colors"
                              >
                                <UploadIcon className="size-4 text-gray-400" />
                                <span className="text-sm">Upload</span>
                              </label>
                              {editableFields.image && (
                                <img
                                  src={editableFields.image}
                                  alt="Preview"
                                  className="w-10 h-10 object-cover rounded-full border border-[#4a4a5a]"
                                />
                              )}
                            </div>
                          ) : user.image ? (
                            <img
                              src={user.image}
                              alt={`${user.name}'s profile`}
                              className="w-10 h-10 object-cover rounded-full border border-[#4a4a5a]"
                            />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-3">
                          {editableUserId === user._id ? (
                            <>
                              <Button
                                onClick={() => updateHandler(user._id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={isUpdating}
                                aria-label="Save changes"
                              >
                                {isUpdating ? (
                                  <Loader2Icon className="size-5 animate-spin mr-2" />
                                ) : (
                                  <FaCheck className="mr-2" />
                                )}
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                onClick={cancelEdit}
                                className="border-[#4a4a5a] text-white hover:bg-[#4a4a5a]"
                                aria-label="Cancel edit"
                              >
                                <FaTimes className="mr-2" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => toggleEdit(user)}
                                className="border-[#4a4a5a] text-white hover:bg-[#4a4a5a]"
                                aria-label={`Edit user ${user.name}`}
                              >
                                <FaEdit className="mr-2" />
                                Edit
                              </Button>
                              {!user.isAdmin && (
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    setUserToDelete(user._id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="bg-red-600 hover:bg-red-700"
                                  aria-label={`Delete user ${user.name}`}
                                >
                                  <FaTrash className="mr-2" />
                                  Delete
                                </Button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[450px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg transition-all duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Delete User</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-300">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setUserToDelete(null);
                }}
                className="border-[#4a4a5a] text-white hover:bg-[#4a4a5a]"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteHandler}
                className="bg-red-600 hover:bg-red-700"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2Icon className="size-5 animate-spin mr-2" />
                ) : (
                  <FaTrash className="mr-2" />
                )}
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default UserList;