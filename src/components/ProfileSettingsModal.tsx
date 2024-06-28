'use client'

import { Button, CustomFlowbiteTheme, Modal } from 'flowbite-react'
import { FloatingLabel } from 'flowbite-react'
import useUserStore from '../store/useStore'
import { Avatar } from 'flowbite-react'
export function ProfileSettingsModal() {
  const {
    userName,
    userEmail,
    userPicture,
    setUserPicture,
    profileSettings,
    setProfileSettings,
  } = useUserStore()
  const button: CustomFlowbiteTheme['floatingLabel'] = {
    input: {
      default: {
        outlined: {
          sm: 'peer block w-full appearance-none rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-xs focus:outline-none focus:ring-0 border-gray-600 text-white focus:border-blue-500',
          md: 'peer block w-full appearance-none rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-sm focus:outline-none focus:ring-0 border-gray-600 text-white focus:border-blue-500',
        },
      },
    },
  }
  const modal: CustomFlowbiteTheme['modal'] = {
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

  return (
    <>
      <Modal
        theme={modal}
        show={profileSettings}
        onClose={() => setProfileSettings(false)}
      >
        <Modal.Header>Profile Settings</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <div className='flex items-center space-x-4'>
              <button
                className='hover:transition-opacity'
                onClick={() => setUserPicture('')}
              >
                <Avatar img={userPicture?.toString()} rounded />
              </button>
              <div className='space-y-1 font-medium text-white'>
                <div>{userName}</div>
                <div className='text-sm text-gray-400'>{userEmail}</div>
              </div>
            </div>
            <div>
              <p className='text-gray-50'>Memory Transfer</p>
            </div>
            <div className='grid grid-flow-col justify-stretch space-x-4'>
              <FloatingLabel
                theme={button}
                variant='outlined'
                placeholder='"John.doe@gmail.com"'
                label=''
                sizing='sm'
                helperText='You will transfer all your memories to this new gmail account.'
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div></div>
          <Button color='gray' onClick={() => setProfileSettings(false)}>
            <p className='text-gray-900'>Done</p>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
