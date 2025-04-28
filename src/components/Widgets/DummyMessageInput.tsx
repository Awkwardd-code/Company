import { Laugh, Mic, Send } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const DummyMessageInput = () => {
  return (
    <div className='bg-gray-primary p-2 flex gap-4 items-center'>
      <div className='relative flex gap-2 ml-2'>
        {/* Placeholder for Emoji Picker */}
        <div>
          <Laugh className='text-gray-600 dark:text-gray-400' />
        </div>
        {/* Placeholder for Media Dropdown */}
        <div>
          <svg
            className='text-gray-600 dark:text-gray-400'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='10' />
            <line x1='12' y1='8' x2='12' y2='16' />
            <line x1='8' y1='12' x2='16' y2='12' />
          </svg>
        </div>
      </div>
      <div className='w-full flex gap-3'>
        <div className='flex-1'>
          <Input
            type='text'
            placeholder='Type a message'
            className='py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent'
            value=''
            readOnly
            disabled
          />
        </div>
        <div className='mr-4 flex items-center gap-3'>
          <Button
            size={"sm"}
            className='bg-transparent text-foreground hover:bg-transparent'
            disabled
          >
            <Mic />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DummyMessageInput;