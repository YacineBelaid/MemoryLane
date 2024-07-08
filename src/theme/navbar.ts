import { CustomFlowbiteTheme } from "flowbite-react";

export const NavbarTheme: CustomFlowbiteTheme['navbar'] = {
    root: {
      base: 'bg-transparent pt-4',
      inner: {
        base: 'mx-auto flex flex-wrap items-center justify-between',
      },
    },
    brand: {
      base: 'flex items-center',
    },
    collapse: {
      base: 'w-full md:block md:w-auto',
      list: 'mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium',
      hidden: {
        on: 'hidden',
        off: '',
      },
    },
    link: {
      base: 'block py-2 pl-3 pr-4 md:p-0',
      active: {
        on: ' text-white md:bg-transparent md:text-cyan-700',
        off: 'border-b border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white md:border-0  md:hover:bg-transparent md:hover:text-white',
      },
      disabled: {
        on: 'hover:cursor-not-allowed text-gray-600',
        off: '',
      },
    },
    toggle: {
      base: 'inline-flex items-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2  text-gray-400 hover:bg-gray-700 focus:ring-gray-600 md:hidden',
      icon: 'h-6 w-6 shrink-0',
    },
  }
