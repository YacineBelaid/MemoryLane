'use client'
import { useState } from 'react'
import { Button, Modal, Table, FloatingLabel, Tabs } from 'flowbite-react'
import { HiAdjustments, HiUserCircle, HiX } from 'react-icons/hi'
import { MdDashboard } from 'react-icons/md'
import useUserStore from '../../store/useStore'
import { FriendDelete } from './FriendDeleteModal'
import { friendButton } from './../../theme/floatingLabels'
import { fullWidthTabsTheme } from './../../theme/tabs'
import { buttonSelect } from './../../theme/buttonGroups'
import { friendModalTheme } from './../../theme/modal'
import { useAllFriends } from '../../services/friend.service'
import { useInviteFriend } from '../../services/friend.service'
import {
  usePendingFriendships,
  useHandleFriendshipAction,
} from '../../services/friend.service'

export function FriendModal() {
  const {
    openModal,
    setOpenModal,
    openfriendDeleteModal,
    user,
  } = useUserStore()
  const {
    data: pendingFriendships,
    isLoading: isPendingLoading,
    error: pendingError,
  } = usePendingFriendships()
  const { data: friends, isLoading, error } = useAllFriends()
  const [friendInput, setFriendInput] = useState('')

  const handleFriendshipActionMutation = useHandleFriendshipAction({
    onSuccess: () => {},
    onError: (error) => {
      console.error('Failed to handle friendship action:', error)
    },
  })

  const handleFriendshipAction = (
    userId:string,
    friendId: string,
    action: 'confirm' | 'reject'
  ) => {
    console.log("Friendship:",userId,friendId)
    handleFriendshipActionMutation.mutate({ userId, friendId, action })
  }

  const inviteFriendMutation = useInviteFriend({
    onSuccess: () => {
      setFriendInput('')
    },
    onError: (error) => {
      console.error('Failed to invite friend:', error)
    },
  })

  const handleInviteFriend = () => {
    if (friendInput.trim()) {
      console.log('Inviting friend:', friendInput.trim())
      inviteFriendMutation.mutate(friendInput.trim())
    } else {
      console.error('Friend input is empty')
    }
  }

  return (
    <>
      {openfriendDeleteModal ? (
        <FriendDelete></FriendDelete>
      ) : (
        <Modal
          theme={friendModalTheme}
          show={openModal}
          onClose={() => setOpenModal(false)}
        >
          <Modal.Header>Friends Settings</Modal.Header>
          <Tabs
            theme={fullWidthTabsTheme}
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
                      theme={friendButton}
                      variant='outlined'
                      placeholder='"John.doe@gmail.com" or "John Doe"'
                      label=''
                      sizing='sm'
                      helperText='If your friends are not registered on the app, enter their email in order to invite them.'
                      value={friendInput}
                      onChange={(e) => setFriendInput(e.target.value)}
                    />
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    <Button
                      onClick={handleInviteFriend}
                      disabled={inviteFriendMutation.isLoading}
                    >
                      {inviteFriendMutation.isLoading
                        ? 'Sending...'
                        : 'Send Invitation'}
                    </Button>
                  </div>
                  {inviteFriendMutation.isSuccess && (
                    <p className='text-green-500'>
                      Invitation sent successfully!
                    </p>
                  )}
                  {inviteFriendMutation.isError && (
                    <p className='text-red-500'>
                      Failed to send invitation:{' '}
                      {inviteFriendMutation.error?.message || 'Unknown error'}
                    </p>
                  )}
                </div>
              </Modal.Body>
            </Tabs.Item>
            <Tabs.Item title='Friend requests' icon={MdDashboard}>
              <Modal.Footer>
                <p className='text-white'>Friend Requests</p>
              </Modal.Footer>
              <Modal.Body>
                <div className='overflow-x-auto overflow-y-auto'>
                  {isPendingLoading ? (
                    <p className='text-white'>Loading pending requests...</p>
                  ) : pendingError ? (
                    <p className='text-white'>
                      Error loading pending requests: {pendingError.message}
                    </p>
                  ) : pendingFriendships && pendingFriendships.length > 0 ? (
                    <Table>
                      <Table.Head className='sticky'>
                        <Table.HeadCell className='bg-gray-600 text-white'>
                          Name
                        </Table.HeadCell>
                        <Table.HeadCell className='bg-gray-600 text-white'>
                          <span className='sr-only'>Actions</span>
                        </Table.HeadCell>
                      </Table.Head>
                      <Table.Body className='divide-y'>
                        {pendingFriendships.map((friendship) => (
                          <Table.Row
                            key={`${friendship.userId}-${friendship.friendId}`}
                            className='border-gray-700 bg-gray-800'
                          >
                            <Table.Cell className='whitespace-nowrap font-medium text-white'>
                              {friendship.friendName}
                            </Table.Cell>
                            <Table.Cell>
                              <Button.Group outline theme={buttonSelect}>
                                <Button
                                  color='green'
                                  className='mr-5 text-white bg-green-600'
                                  onClick={() =>
                                    handleFriendshipAction(
                                      `${friendship.userId}`,`${friendship.friendId}`,
                                      'confirm'
                                    )
                                  }
                                  disabled={
                                    handleFriendshipActionMutation.isLoading
                                  }
                                >
                                  <HiUserCircle className='mr-3 h-4 w-4' />
                                  Accept
                                </Button>
                                <Button
                                  color='red'
                                  className='text-white bg-red-600'
                                  onClick={() =>
                                    handleFriendshipAction(
                                      `${friendship.userId}`,`${friendship.friendId}`,
                                      'reject'
                                    )
                                  }
                                  disabled={
                                    handleFriendshipActionMutation.isLoading
                                  }
                                >
                                  <HiAdjustments className='mr-3 h-4 w-4' />
                                  Decline
                                </Button>
                              </Button.Group>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  ) : (
                    <p className='text-white'>
                      You don't have any pending friend requests.
                    </p>
                  )}
                </div>
              </Modal.Body>
            </Tabs.Item>
            <Tabs.Item title='Friend List' icon={HiAdjustments}>
              <Modal.Footer>
                <p className='text-white'>Friend List</p>
              </Modal.Footer>
              <Modal.Body>
                <div className='space-y-6'>
                  {isLoading ? (
                    <p className='text-white'>Loading friends...</p>
                  ) : error ? (
                    <p className='text-white'>
                      Error loading friends: {error.message}
                    </p>
                  ) : friends && friends.length > 0 ? (
                    <Table>
                      <Table.Head>
                        <Table.HeadCell className='bg-gray-600 text-white'>
                          Name
                        </Table.HeadCell>
                        <Table.HeadCell className='bg-gray-600 text-white'>
                          <span className='sr-only'>Delete</span>
                        </Table.HeadCell>
                      </Table.Head>
                      <Table.Body className='divide-y'>
                        {friends.map((friend) => (
                          <Table.Row
                            key={friend.id}
                            className='border-gray-700 bg-gray-800'
                          >
                            <Table.Cell className='whitespace-nowrap font-medium text-white'>
                              {friend.name}
                            </Table.Cell>
                            <Table.Cell>
                              <Button
                                color='red'
                                size='sm'
                                onClick={() =>
                                  handleFriendshipAction(
                                    `${friend.id}`,`${user?.id}`,
                                    'reject'
                                  )
                                }
                                disabled={
                                  handleFriendshipActionMutation.isLoading
                                }
                              >
                                <HiX className='h-4 w-4' />
                                <span className='sr-only'>Delete</span>
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  ) : (
                    <p className=' text-white'>
                      You don't have any friends yet.
                    </p>
                  )}
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
