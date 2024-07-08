import { CustomFlowbiteTheme } from "flowbite-react";

export const DropdownTheme: CustomFlowbiteTheme['dropdown'] = {
  arrowIcon: 'ml-2 h-4 w-4 text-gray-300', 
  content: 'py-1 focus:outline-none text-gray-200',
  floating: {
    animation: 'transition-opacity',
    arrow: {
      base: 'absolute z-10 h-2 w-2 rotate-45',
      style: {
        auto: 'bg-gray-700',
      },
      placement: '-4px',
    },
    base: 'z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none',
    content: 'py-1 text-sm text-gray-200',
    divider: 'my-1 h-px bg-gray-600',
    header: 'block px-4 py-2 text-sm text-gray-200',
    hidden: 'invisible opacity-0',
    item: {
      container: '',
      base: 'flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white focus:bg-gray-600 focus:text-white',
      icon: 'mr-2 h-4 w-4',
    },
    style: {
      auto: 'border border-none bg-gray-700 text-white',
    },
    target: 'w-fit',
  },
  inlineWrapper: 'flex items-center text-gray-300', 
}
