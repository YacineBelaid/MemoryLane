import { CustomFlowbiteTheme } from "flowbite-react";

export const fullWidthTabsTheme: CustomFlowbiteTheme['tabs'] ={
    "base": "flex flex-col gap-2",
    "tablist": {
      "base": "flex text-center",
      "variant": {
        "fullWidth": "grid w-full grid-flow-col divide-x rounded-none text-sm font-medium shadow divide-gray-700 text-gray-400"
      },
      "tabitem": {
        "base": "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none",
        "variant": {
          "fullWidth": {
            "base": "ml-0 flex w-full rounded-none first:ml-0",
            "active": {
              "on": "active rounded-none bg-gray-700 text-white",
              "off": "rounded-none bg-gray-800 hover:bg-gray-700 hover:text-white"
            }
          }
        },
        "icon": "mr-2 h-5 w-5"
      }
    },
    "tabitemcontainer": {
    "base": "h-[40vh]",
    "variant": {
      "default": "",
      "underline": "",
      "pills": "",
      "fullWidth": ""
    }
  },
    "tabpanel": "py-3"
  }