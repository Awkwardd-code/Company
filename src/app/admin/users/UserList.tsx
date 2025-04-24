import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useQuery, useMutation } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";
import LoaderUI from "@/components/LoaderUI";

interface User {
    _id: Id<"users">;
    name: string;
    email: string;
    isAdmin: boolean;
}

function UserList() {
    const users = useQuery(api.users.getUsers, {}) as User[] | undefined;
    const deleteUser = useMutation(api.users.deleteUser);
    const updateUser = useMutation(api.users.editUser);

    const [editableUserId, setEditableUserId] = useState<Id<"users"> | null>(null);
    const [editableFields, setEditableFields] = useState({
        id: "",
        name: "",
        email: "",
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const deleteHandler = async (id: Id<"users">) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteUser({ id });
                toast.success("User deleted successfully!");
            } catch (err) {
                toast.error("Failed to delete user");
            }
        }
    };

    const toggleEdit = (user: User) => {
        setEditableUserId(user._id);
        setEditableFields({ id: user._id.toString(), name: user.name, email: user.email });
    };

    const cancelEdit = () => {
        setEditableUserId(null);
        setEditableFields({ id: "", name: "", email: "" });
    };

    const updateHandler = async (id: Id<"users">, updatedFields = {}) => {
        if (!editableFields.id || !editableFields.name || !editableFields.email) {
            toast.error("All fields are required");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(editableFields.email)) {
            toast.error("Invalid email format");
            return;
        }

        setIsUpdating(true);
        try {
            await updateUser({
                id,
                name: editableFields.name,
                email: editableFields.email,
                ...updatedFields,
            });
            setEditableUserId(null);
            toast.success("User updated successfully!");
        } catch (err) {
            toast.error("Failed to update user");
        } finally {
            setIsUpdating(false);
        }
    };

    const isLoading = users === undefined;
    const isUsersAvailable = Array.isArray(users) && users.length > 0;

    return (
        <div className="bg-gray-900 flex items-center justify-center py-2 min-h-screen">
            <div className="container mx-auto px-6 w-full max-w-7xl">
                <h1 className="text-4xl font-extrabold text-white text-center mb-6">Users Management</h1>
                {isLoading ? (
                    <LoaderUI />
                ) : !users ? (
                    <div className="text-red-500 text-center">Failed to load users</div>
                ) : (
                    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
                        {/* Mobile View */}
                        <div className="block sm:hidden">
                            {isUsersAvailable ? (
                                users.map((user) => (
                                    <div
                                        key={user._id}
                                        className="bg-gray-700 text-white p-6 mb-6 rounded-lg shadow-md"
                                    >
                                        <div className="flex flex-col">
                                            {editableUserId === user._id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editableFields.id}
                                                        onChange={(e) =>
                                                            setEditableFields({
                                                                ...editableFields,
                                                                id: e.target.value,
                                                            })
                                                        }
                                                        className="w-full p-3 mb-4 border border-gray-500 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-pink-500"
                                                        placeholder="Edit ID"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editableFields.name}
                                                        onChange={(e) =>
                                                            setEditableFields({
                                                                ...editableFields,
                                                                name: e.target.value,
                                                            })
                                                        }
                                                        className="w-full p-3 mb-4 border border-gray-500 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-pink-500"
                                                        placeholder="Edit Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editableFields.email}
                                                        onChange={(e) =>
                                                            setEditableFields({
                                                                ...editableFields,
                                                                email: e.target.value,
                                                            })
                                                        }
                                                        className="w-full p-3 mb-4 border border-gray-500 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-pink-500"
                                                        placeholder="Edit Email"
                                                    />
                                                    <div className="flex justify-center gap-4 mt-4">
                                                        <button
                                                            onClick={() => updateHandler(user._id)}
                                                            aria-label="Save changes"
                                                            disabled={isUpdating}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg flex items-center"
                                                        >
                                                            {isUpdating ? "Saving..." : <FaCheck />}
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            aria-label="Cancel edit"
                                                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg flex items-center"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-xl font-semibold">ID: {user._id}</h3>
                                                    <h3 className="text-xl font-semibold">{user.name}</h3>
                                                    <p className="text-gray-300">Email: {user.email}</p>
                                                    <p className="text-gray-300">
                                                        Role:{" "}
                                                        {user.isAdmin ? (
                                                            <span className="text-green-500">Admin</span>
                                                        ) : (
                                                            <span className="text-red-500">User</span>
                                                        )}
                                                    </p>
                                                    <div className="flex justify-center gap-4 mt-4">
                                                        <button
                                                            onClick={() => toggleEdit(user)}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg flex items-center"
                                                            aria-label={`Edit user ${user.name}`}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        {!user.isAdmin && (
                                                            <button
                                                                onClick={() => deleteHandler(user._id)}
                                                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg flex items-center"
                                                                aria-label={`Delete user ${user.name}`}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400">No users found</div>
                            )}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden sm:block">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-700 text-gray-300 text-sm">
                                    <tr>
                                        <th className="px-6 py-4 text-left">ID</th>
                                        <th className="px-6 py-4 text-left">NAME</th>
                                        <th className="px-6 py-4 text-left">EMAIL</th>
                                        <th className="px-6 py-4 text-left">ADMIN</th>
                                        <th className="px-6 py-4 text-left">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-700 text-white">
                                    {isUsersAvailable ? (
                                        users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-600 transition-all duration-200">
                                                <td className="px-6 py-3">
                                                    {editableUserId === user._id ? (
                                                        <input
                                                            type="text"
                                                            value={editableFields.id}
                                                            onChange={(e) =>
                                                                setEditableFields({
                                                                    ...editableFields,
                                                                    id: e.target.value,
                                                                })
                                                            }
                                                            className="w-full p-2 border border-gray-500 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-pink-500"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <span>{user._id}</span>
                                                            <button
                                                                onClick={() => toggleEdit(user)}
                                                                aria-label={`Edit user ${user._id}`}
                                                                className="text-gray-400 hover:text-pink-400"
                                                                disabled={editableUserId !== null}
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3">
                                                    {editableUserId === user._id ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={editableFields.name}
                                                                onChange={(e) =>
                                                                    setEditableFields({
                                                                        ...editableFields,
                                                                        name: e.target.value,
                                                                    })
                                                                }
                                                                className="w-full p-2 border border-gray-500 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-pink-500"
                                                            />
                                                            <button
                                                                onClick={() => updateHandler(user._id)}
                                                                aria-label="Save changes"
                                                                disabled={isUpdating}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                                                            >
                                                                {isUpdating ? "Saving..." : <FaCheck />}
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                aria-label="Cancel edit"
                                                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <span>{user.name}</span>
                                                            <button
                                                                onClick={() => toggleEdit(user)}
                                                                aria-label={`Edit user ${user.name}`}
                                                                className="text-gray-400 hover:text-pink-400"
                                                                disabled={editableUserId !== null}
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3">
                                                    {editableUserId === user._id ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={editableFields.email}
                                                                onChange={(e) =>
                                                                    setEditableFields({
                                                                        ...editableFields,
                                                                        email: e.target.value,
                                                                    })
                                                                }
                                                                className="w-full p-2 border border-gray-500 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-pink-500"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <span>{user.email}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    {user.isAdmin ? (
                                                        <FaCheck className="text-green-500" />
                                                    ) : (
                                                        <FaTimes className="text-red-500" />
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 flex justify-center space-x-2">
                                                    {!user.isAdmin && (
                                                        <button
                                                            onClick={() => deleteHandler(user._id)}
                                                            aria-label={`Delete user ${user.name}`}
                                                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition transform hover:scale-105"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-3 text-center text-gray-400">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserList;
