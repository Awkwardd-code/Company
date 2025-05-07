import { Id } from "../../../../../convex/_generated/dataModel";

interface ProjectCardProps {
  project: {
    _id: Id<"projects">;
    userId: Id<"users">;
    name: string;
    url: string;
    coverImage?: string;
    createdAt?: number;
    updatedAt?: number;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="p-4 bg-[#2a2a3a] border border-[#313244] rounded-lg flex flex-col gap-4 max-w-sm w-full">
      {/* Cover Image Preview */}
      {project.coverImage && (
        <div className="w-full h-48 rounded-md border border-[#3a3a4a] overflow-hidden">
          <img
            src={project.coverImage}
            alt={`${project.name} cover`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Project Info */}
      <div className="flex flex-col gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-semibold text-white truncate"
            title={project.name} // Tooltip for full project name
          >
            {project.name}
          </h3>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:underline line-clamp-2 break-all"
            title={project.url} // Tooltip for full URL
          >
            {project.url}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
