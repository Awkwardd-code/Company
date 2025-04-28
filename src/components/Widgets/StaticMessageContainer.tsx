import LoaderUI from "../LoaderUI";
import TryUsOutButton from "@/app/(root)/(home)/_components/TryUsOutButton";

const StaticMessageContainer = () => {
  return (
    <div className="relative p-4 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark flex flex-col">
      <div className="mx-12 flex flex-col items-center justify-center flex-1 gap-4">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Please sign in to start chatting!
        </p>
        <TryUsOutButton />
      </div>
    </div>
  );
};

export default StaticMessageContainer;