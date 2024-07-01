import { Memory } from '@/interfaces/memory.inteface'
import { useUserPictureAndNameById } from './../services/user.service'
import { Dropdown } from 'flowbite-react'
export function MemoryCard({ memory }: { memory: Memory }) {
  const {
    data: userInfo,
    isLoading,
    error,
  } = useUserPictureAndNameById(memory.user_id, {})

  function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  function formatDate(date: Date) {
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`
  }

  if (isLoading) return <div>Loading user info...</div>
  if (error) return <div>Error loading user info</div>

  return (
    <figure className='rounded-2xl bg-gray-800 p-6 shadow-lg ring-1 ring-gray-900/5'>
      <div className='right-0'>
      <Dropdown label='Settings' inline>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Delete</Dropdown.Item>
      </Dropdown>
      </div>
      <img src={memory.picture_url}></img>
      <p className='text-xl font-semibold italic text-white'>{memory.name}</p>
      <blockquote className='text-white'>
        <p>"{memory.description}"</p>
      </blockquote>
      <figcaption className='mt-6 flex items-center gap-x-4'>
        <img
          className='h-10 w-10 rounded-full bg-gray-50'
          src={userInfo?.picture_link || '/default-avatar.jpg'}
          alt={`Profile picture of ${userInfo?.name}`}
        />
        <div>
          <div className='font-semibold text-gray-50'>
            {userInfo?.name || 'Unknown User'}
          </div>
          <div className='text-gray-200'>
            {formatDate(new Date(memory.timestamp))}
          </div>
        </div>
      </figcaption>
    </figure>
  )
}
