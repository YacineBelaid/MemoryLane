import { CustomFlowbiteTheme } from 'flowbite-react';

export const createMemory: CustomFlowbiteTheme['modal'] = {
  header: {
    base: "flex items-start justify-between rounded-t border-b p-5 border-gray-600",
    title: "text-xl font-medium text-white"
  },
  body: {
    base: "p-6 flex-1 overflow-auto",
  },
  footer: {
    base: "flex items-center justify-between space-x-2 rounded-b border-t border-gray-600 p-6",
  },
  content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner: "relative rounded-lg bg-gray-800 shadow flex flex-col max-h-[90vh]",
  }
};
export const friendModal: CustomFlowbiteTheme['modal'] = {
    header: {
      base: "flex items-start justify-between rounded-t border-b p-5 border-gray-600",
      title: "text-xl font-medium text-white"
    },
    body: {
      base: "p-6 flex-1 overflow-auto",
    },
    footer: {
      base: "flex items-center justify-between space-x-2 rounded-b border-t border-gray-600 p-6",
    },
    content: {
      base: "relative h-full w-full p-4 md:h-auto",
      inner: "relative rounded-lg bg-gray-800 shadow flex flex-col max-h-[90vh]",
    }
  };

  export const profileSettings: CustomFlowbiteTheme['modal'] = {
    header: {
      base: 'flex items-start justify-between rounded-t border-b p-5 border-gray-600',
      title: 'text-xl font-medium text-white',
    },
    body: {
      base: 'p-6 flex-1 overflow-auto',
    },
    footer: {
      base: 'flex items-center justify-between space-x-2 rounded-b border-t border-gray-600 p-6',
    },
    content: {
      base: 'relative h-full w-full p-4 md:h-auto',
      inner:
        'relative rounded-lg bg-gray-800 shadow flex flex-col max-h-[90vh]',
    },
  }