"use client";

import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { api } from "../../../../convex/_generated/api";

function BlogsUI() {
  const { user } = useUser();
  const blogs = useQuery(api.blogs.get) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const addBlog = useMutation(api.blogs.add);
  const updateBlog = useMutation(api.blogs.update);
  const deleteBlog = useMutation(api.blogs.remove);
  const auther = useQuery(api.users.getMe);
  console.log(auther?._id)
  const generateUploadUrl = useMutation(api.blogs.generateUploadUrl);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isAuthorLoading, setIsAuthorLoading] = useState(true);
  const [selectedBlogId, setSelectedBlogId] = useState<Id<"blogs"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    coverImage: "",
    published: false,
    authorId: "" as string | Id<"users">,
    tags: [] as string[],
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    slug: "",
    content: "",
    coverImage: "",
    published: false,
    authorId: "" as string | Id<"users">,
    tags: [] as string[],
  });

  // Set authorId when user is available
  useEffect(() => {
    const setAuthor = async () => {
      setIsAuthorLoading(true);
      try {
        if (user && users.length > 0) {
          const dbUser = auther;
          if (dbUser) {
            setFormData(prev => ({
              ...prev,
              authorId: dbUser?._id
            }));
          } else {
            toast.error("User not found in database. Please contact support.");
          }
        }
      } catch (error) {
        console.error("Error setting author:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsAuthorLoading(false);
      }
    };

    setAuthor();
  }, [user, users]);

  const handleAddBlog = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      toast.error("Slug can only contain lowercase letters, numbers, and hyphens");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }
    if (!formData.authorId) {
      toast.error("Unable to determine author");
      return;
    }

    setIsSubmitting(true);
    try {
      let storageId: Id<"_storage"> | null = null;
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

      if (!storageId && !formData.coverImage) {
        toast.error("Cover image is required");
        return;
      }

      await addBlog({
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        content: formData.content.trim(),
        coverImage: storageId as Id<"_storage">,
        published: formData.published,
        authorId: formData.authorId as Id<"users">,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      });

      setAddOpen(false);
      setFormData({
        title: "",
        slug: "",
        content: "",
        coverImage: "",
        published: false,
        authorId: formData.authorId, // Keep the same author
        tags: [],
      });
      setImageFile(null);
      toast.success("Blog added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBlog = async () => {
    if (!selectedBlogId) {
      toast.error("No blog selected");
      return;
    }
    if (!editFormData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editFormData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(editFormData.slug)) {
      toast.error("Slug can only contain lowercase letters, numbers, and hyphens");
      return;
    }
    if (!editFormData.content.trim()) {
      toast.error("Content is required");
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

      await updateBlog({
        id: selectedBlogId,
        title: editFormData.title.trim(),
        slug: editFormData.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        content: editFormData.content.trim(),
        coverImage: storageId as Id<"_storage">,
        published: editFormData.published,
        tags: editFormData.tags.length > 0 ? editFormData.tags : undefined,
      });

      setEditOpen(false);
      setEditFormData({
        title: "",
        slug: "",
        content: "",
        coverImage: "",
        published: false,
        authorId: editFormData.authorId, // Keep the same author
        tags: [],
      });
      setEditImageFile(null);
      setSelectedBlogId(null);
      toast.success("Blog updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveBlog = async () => {
    if (!selectedBlogId) return;

    setIsSubmitting(true);
    try {
      await deleteBlog({ id: selectedBlogId });
      setDeleteOpen(false);
      toast.success("Blog removed successfully");
      setSelectedBlogId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (blog: typeof blogs[0]) => {
    setEditFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      coverImage: blog.coverImage || "",
      published: blog.published,
      authorId: blog.authorId,
      tags: blog.tags || [],
    });
    setSelectedBlogId(blog._id);
    setEditOpen(true);
  };

  const handleTagInput = (value: string, isEdit: boolean = false) => {
    const setData = isEdit ? setEditFormData : setFormData;
    const tags = value.split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 5);
    setData(prev => ({
      ...prev,
      tags,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      if (isEdit) {
        setEditImageFile(file);
        setEditFormData(prev => ({ ...prev, coverImage: imageUrl }));
      } else {
        setImageFile(file);
        setFormData(prev => ({ ...prev, coverImage: imageUrl }));
      }
    }
  };

  if (!blogs || !users || isAuthorLoading) {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Blogs</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your blog posts</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isAuthorLoading}
            >
              {isAuthorLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Add Blog"
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[550px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Add Blog</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Title*</label>
                <Input
                  placeholder="Blog title"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Slug*</label>
                <Input
                  placeholder="blog-slug"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <p className="text-xs text-gray-400">Lowercase letters, numbers, and hyphens only</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Content*</label>
                <Textarea
                  placeholder="Blog content"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white min-h-[200px]"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Cover Image*</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
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
                <label className="text-sm font-medium text-gray-200">Published</label>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                    className="border-[#3a3a4a] data-[state=checked]:bg-indigo-600"
                  />
                  <span className="text-sm text-white">Publish this blog</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Author</label>
                <Input
                  value={auther?.name || "You"}
                  disabled
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Tags</label>
                <Input
                  placeholder="tag1, tag2, tag3"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.tags.join(", ")}
                  onChange={(e) => handleTagInput(e.target.value)}
                />
                <p className="text-xs text-gray-400">Max 5 tags, separated by commas</p>
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
                  onClick={handleAddBlog}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isSubmitting || !imageFile}
                >
                  {isSubmitting && <Loader2Icon className="size-5 animate-spin mr-2" />}
                  Add Blog
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
            <DialogTitle className="text-xl text-white">Edit Blog</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Title*</label>
              <Input
                placeholder="Blog title"
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Slug*</label>
              <Input
                placeholder="blog-slug"
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                value={editFormData.slug}
                onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
              />
              <p className="text-xs text-gray-400">Lowercase letters, numbers, and hyphens only</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Content*</label>
              <Textarea
                placeholder="Blog content"
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white min-h-[200px]"
                value={editFormData.content}
                onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
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
              <label className="text-sm font-medium text-gray-200">Published</label>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={editFormData.published}
                  onCheckedChange={(checked) => setEditFormData({ ...editFormData, published: checked as boolean })}
                  className="border-[#3a3a4a] data-[state=checked]:bg-indigo-600"
                />
                <span className="text-sm text-white">Publish this blog</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Author</label>
              <Input
                value={users.find(u => u._id === editFormData.authorId)?.name || "Unknown Author"}
                disabled
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Tags</label>
              <Input
                placeholder="tag1, tag2, tag3"
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                value={editFormData.tags.join(", ")}
                onChange={(e) => handleTagInput(e.target.value, true)}
              />
              <p className="text-xs text-gray-400">Max 5 tags, separated by commas</p>
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
                onClick={handleUpdateBlog}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2Icon className="size-5 animate-spin mr-2" />}
                Update Blog
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[450px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Delete Blog</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-300">
              Are you sure you want to delete this blog? This action cannot be undone.
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
              onClick={handleRemoveBlog}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2Icon className="size-5 animate-spin mr-2" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Blogs List */}
      {blogs.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => {
            const author = users.find((u) => u._id === blog.authorId);
            return (
              <div
                key={blog._id}
                className="bg-[#1d1d2e] border border-[#2a2a3a] rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                {blog.coverImage && (
                  <div className="w-full h-48 bg-[#2a2a3a] rounded-md border border-[#3a3a4a] overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={`${blog.title} cover`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">{blog.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3">{blog.content}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-200">Author</h4>
                  <p className="text-sm text-white">{author?.name || "Unknown Author"}</p>
                </div>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-200">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs text-white bg-[#2a2a3a] px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-200">Status</h4>
                  <p className="text-sm text-white">
                    {blog.published ? (
                      <span className="text-green-400">Published</span>
                    ) : (
                      <span className="text-yellow-400">Draft</span>
                    )}
                  </p>
                </div>
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleEditClick(blog)}
                    className="border-[#3a3a4a] text-white hover:bg-[#3a3a4a]"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedBlogId(blog._id);
                      setDeleteOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No blogs found. Add a blog to get started.</p>
          <Button
            onClick={() => setAddOpen(true)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Create Your First Blog
          </Button>
        </div>
      )}
    </div>
  );
}

export default BlogsUI;