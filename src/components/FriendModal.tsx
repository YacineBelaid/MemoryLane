
"use client";

import { Button, CustomFlowbiteTheme, Modal } from "flowbite-react";
import { FloatingLabel } from "flowbite-react";
import { Kbd } from "flowbite-react";
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { Table } from "flowbite-react";
import useUserStore from './../store/useStore'
export function FriendModal() {
  const { openModal, setOpenModal } = useUserStore()
  const button: CustomFlowbiteTheme['floatingLabel'] = {
   "input": {
    "default": {
      "outlined": {
        "sm": "peer block w-full appearance-none rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-xs focus:outline-none focus:ring-0 border-gray-600 text-white focus:border-blue-500",
        "md": "peer block w-full appearance-none rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-sm focus:outline-none focus:ring-0 border-gray-600 text-white focus:border-blue-500"
      },
    }
  }
  }
  const buttonSelect: CustomFlowbiteTheme['buttonGroup'] = {
    "base": "inline-flex",
    "position": {
      "none": "",
      "start": "rounded-r-none focus:ring-2",
      "middle": "rounded-none border-l-0 pl-0 focus:ring-2",
      "end": "rounded-l-none border-l-0 pl-0 focus:ring-2"
    }
  }
  const fullWidth: CustomFlowbiteTheme['tabs'] ={
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
  const modal: CustomFlowbiteTheme['modal'] = {
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
  
  return (
    <>
      <Modal theme={modal} show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Friends Settings</Modal.Header>
      <Tabs theme={fullWidth} aria-label="Full width tabs" variant="fullWidth">
      <Tabs.Item active title="Add Friends" icon={HiUserCircle}>
      <Modal.Footer><p className="text-white">Send Requests</p></Modal.Footer>
        <Modal.Body>
          <div className="space-y-6">
          <div className="grid grid-flow-col justify-stretch space-x-4">
          <FloatingLabel theme={button} variant="outlined" placeholder='"John.doe@gmail.com" or "John Doe"'  label="" sizing="sm" helperText="If your friends are not registered on the app, enter their email in order to invite them." />
          </div>
          <div className="flex flex-wrap gap-1">
              <Kbd>yacine.bld.belaid@gmail.com</Kbd>
          </div>
          </div>
        </Modal.Body>
      </Tabs.Item>
      <Tabs.Item title="Friend requests" icon={MdDashboard}>
      <Modal.Footer><p className="text-white">Friend Requests</p></Modal.Footer>
      <div className="overflow-x-auto overflow-y-auto">
      <Table hoverable>
        <Table.Head className="sticky ">
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">       </span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="border-gray-700 bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-white">
              {'Yacine Belaid'}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-white">
            </Table.Cell>
            <Table.Cell>
            <Button.Group outline theme={buttonSelect}>
              <Button color="green" className="mr-5">
                <HiUserCircle className="mr-3 h-4 w-4" />
                Accept
              </Button>
              <Button color="red">
                <HiAdjustments className="mr-3 h-4 w-4" />
                Decline
              </Button>
            </Button.Group>
            </Table.Cell>
          </Table.Row>
          <Table.Row className=" border-gray-700 bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium  text-white">
              {'Amberlee Svendsen'}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-white">
              </Table.Cell>
            <Table.Cell>
            <Button.Group outline theme={buttonSelect}>
              <Button color="green" className="mr-5">
                <HiUserCircle className="mr-3 h-4 w-4" />
                Accept
              </Button>
              <Button color="red">
                <HiAdjustments className="mr-3 h-4 w-4" />
                Decline
              </Button>
            </Button.Group>
            </Table.Cell>
          </Table.Row>
          <Table.Row className=" border-gray-700 bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium  text-white">
              {'Lucas Tiger'}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-white">
            </Table.Cell>
            <Table.Cell>
            <Button.Group outline theme={buttonSelect}>
              <Button color="green" className="mr-5">
                <HiUserCircle className="mr-3 h-4 w-4" />
                Accept
              </Button>
              <Button color="red">
                <HiAdjustments className="mr-3 h-4 w-4" />
                Decline
              </Button>
            </Button.Group>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
      </Tabs.Item>
      <Tabs.Item title="Block List" icon={HiAdjustments}>
      <Modal.Footer><p className="text-white">Block List</p></Modal.Footer>
      <Modal.Body>
          <div className="space-y-6">
          <div className="grid grid-flow-col justify-stretch space-x-4">
            <FloatingLabel theme={button} variant="outlined" placeholder='"John.doe@gmail.com" or "John Doe"' label="" sizing="sm" helperText="If your friends are not registered on the app, enter their email in order to invite them." />
          </div>
          <div className="flex flex-wrap gap-1">
              <Kbd>{"Julia Tangle"}</Kbd>
          </div>
          </div>
        </Modal.Body>
      </Tabs.Item>

    </Tabs>
        <Modal.Footer>
        <div></div>
          <Button color="gray" onClick={() => setOpenModal(false)}>
          <p className="text-gray-900">Done</p> 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
