'use client'

import { Button, Modal } from 'flowbite-react'
import { FloatingLabel } from 'flowbite-react'
import { Kbd } from 'flowbite-react'
import { Tabs } from 'flowbite-react'
import { HiAdjustments, HiUserCircle } from 'react-icons/hi'
import { MdDashboard } from 'react-icons/md'
import { Table } from 'flowbite-react'
import useUserStore from '../../store/useStore'
import { getTheme } from '../../theme/themeUtils'
import { FriendDelete } from './FriendDeleteModal'
export function FriendModal() {
  const {
    openModal,
    setOpenModal,
    openfriendDeleteModal,
    setopenFriendDeleteModal,
  } = useUserStore()
  const button = getTheme('friendButton')
  const buttonSelect = getTheme('buttonSelect')
  const fullWidth = getTheme('fullWidth')
  const modal = getTheme('friendModal')

  return (
    <>
      {openfriendDeleteModal ? (
        <FriendDelete></FriendDelete>
      ) : (
        <Modal
          theme={modal}
          show={openModal}
          onClose={() => setOpenModal(false)}
        >
          <Modal.Header>Friends Settings</Modal.Header>
          <Tabs
            theme={fullWidth}
            aria-label='Full width tabs'
            variant='fullWidth'
          >
            <Tabs.Item active title='Add Friends' icon={HiUserCircle}>
              <Modal.Footer>
                <p className='text-white'>Send Requests</p>
              </Modal.Footer>
              <Modal.Body>
                <div className='space-y-6'>
                  <div className='grid grid-flow-col justify-stretch space-x-4'>
                    <FloatingLabel
                      theme={button}
                      variant='outlined'
                      placeholder='"John.doe@gmail.com" or "John Doe"'
                      label=''
                      sizing='sm'
                      helperText='If your friends are not registered on the app, enter their email in order to invite them.'
                    />
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    <Kbd>yacine.bld.belaid@gmail.com</Kbd>
                  </div>
                </div>
              </Modal.Body>
            </Tabs.Item>
            <Tabs.Item title='Friend requests' icon={MdDashboard}>
              <Modal.Footer>
                <p className='text-white'>Friend Requests</p>
              </Modal.Footer>
              <div className='overflow-x-auto overflow-y-auto'>
                <Table hoverable>
                  <Table.Head className='sticky '>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>
                      <span className='sr-only'> </span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className='divide-y'>
                    <Table.Row className='border-gray-700 bg-gray-800'>
                      <Table.Cell className='whitespace-nowrap font-medium text-white'>
                        {'Yacine Belaid'}
                      </Table.Cell>
                      <Table.Cell className='whitespace-nowrap font-medium text-white'></Table.Cell>
                      <Table.Cell>
                        <Button.Group outline theme={buttonSelect}>
                          <Button color='green' className='mr-5'>
                            <HiUserCircle className='mr-3 h-4 w-4' />
                            Accept
                          </Button>
                          <Button color='red'>
                            <HiAdjustments className='mr-3 h-4 w-4' />
                            Decline
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className=' border-gray-700 bg-gray-800'>
                      <Table.Cell className='whitespace-nowrap font-medium  text-white'>
                        {'Amberlee Svendsen'}
                      </Table.Cell>
                      <Table.Cell className='whitespace-nowrap font-medium text-white'></Table.Cell>
                      <Table.Cell>
                        <Button.Group outline theme={buttonSelect}>
                          <Button color='green' className='mr-5'>
                            <HiUserCircle className='mr-3 h-4 w-4' />
                            Accept
                          </Button>
                          <Button color='red'>
                            <HiAdjustments className='mr-3 h-4 w-4' />
                            Decline
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className=' border-gray-700 bg-gray-800'>
                      <Table.Cell className='whitespace-nowrap font-medium  text-white'>
                        {'Lucas Tiger'}
                      </Table.Cell>
                      <Table.Cell className='whitespace-nowrap font-medium text-white'></Table.Cell>
                      <Table.Cell>
                        <Button.Group outline theme={buttonSelect}>
                          <Button color='green' className='mr-5'>
                            <HiUserCircle className='mr-3 h-4 w-4' />
                            Accept
                          </Button>
                          <Button color='red'>
                            <HiAdjustments className='mr-3 h-4 w-4' />
                            Decline
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </Tabs.Item>
            <Tabs.Item title='Friend List' icon={HiAdjustments}>
              <Modal.Footer>
                <p className='text-white'>Friend List</p>
              </Modal.Footer>
              <Modal.Body>
                <div className='space-y-6'>
                  <div className='grid grid-flow-col justify-stretch space-x-4'>
                    <FloatingLabel
                      theme={button}
                      variant='outlined'
                      placeholder='"John.doe@gmail.com" or "John Doe"'
                      label=''
                      sizing='sm'
                      helperText='Only users in your friend list will have access to your private memories '
                    />
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    <Kbd>
                      {'Julia Tangle'}
                      <>
                        <button
                          className='ml-2'
                          onClick={() => {setopenFriendDeleteModal(true)
                          }}
                        >
                          X
                        </button>
                      </>
                    </Kbd>
                  </div>
                </div>
              </Modal.Body>
            </Tabs.Item>
          </Tabs>
          <Modal.Footer>
            <div></div>
            <Button color='gray' onClick={() => setOpenModal(false)}>
              <p className='text-gray-900'>Done</p>
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}
