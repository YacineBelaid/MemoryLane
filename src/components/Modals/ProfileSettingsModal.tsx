'use client'

import { Button, Modal } from 'flowbite-react'
import { FloatingLabel } from 'flowbite-react'
import useUserStore from '../../store/useStore'
import { Avatar } from 'flowbite-react'
import { getTheme } from '../../theme/themeUtils';
export function ProfileSettingsModal() {
  const {
    user,
    profileSettings,
    setProfileSettings,
  } = useUserStore()
  const modal = getTheme("profileSettings")
  const button = getTheme("friendButton")
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
                <Avatar img={user?.picture?.toString()} rounded />
              </button>
              <div className='space-y-1 font-medium text-white'>
                <div>{user?.name}</div>
                <div className='text-sm text-gray-400'>{user?.email}</div>
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
