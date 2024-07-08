'use client'

import { Button, Modal } from 'flowbite-react'
import useUserStore from '../../store/useStore'
import { Avatar } from 'flowbite-react'
import {profileSettingsTheme} from '../../theme/modal'
export function ProfileSettingsModal() {
  const {
    user,
    profileSettings,
    setProfileSettings,
  } = useUserStore()
  return (
    <>
      <Modal
        theme={profileSettingsTheme}
        show={profileSettings}
        onClose={() => setProfileSettings(false)}
      >
        <Modal.Header>Profile Settings</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <div className='flex items-center space-x-4'>
                <Avatar img={user?.picture?.toString()} rounded />
              <div className='space-y-1 font-medium text-white'>
                <div>{user?.name}</div>
                <div className='text-sm text-gray-400'>{user?.email}</div>
              </div>
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
