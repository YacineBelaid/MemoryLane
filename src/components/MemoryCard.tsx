import { Memory } from '@/interfaces/memory.inteface'
import { useUserPictureAndNameById } from './../services/user.service'
import { Dropdown } from 'flowbite-react'
import { DropdownTheme } from '../theme/dropdown';
import { User } from '@/interfaces/user.interface';
import useUserStore from './../store/useStore';
export function MemoryCard({ memory, currentUser }: { memory: Memory; currentUser: User | null }) {


  const {
    setMemoryModal,
    setMemoryToEdit,
    setopenMemoryDeleteModal,
    setMemoryToDeleteId
  } = useUserStore()
  
  const {
    data: userInfo,
    isLoading,
    error,
  } = useUserPictureAndNameById(memory.user_id, {})

  const handleEdit = () => {
    setMemoryToEdit(memory)
    setMemoryModal(true)
  }
  

  const handleDelete = () => {
    setMemoryToDeleteId(memory.id)
    setopenMemoryDeleteModal(true)
  }

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
  
  const isCurrentUserAuthor = memory.user_id === currentUser?.id;

  return (
    <figure className='rounded-2xl bg-gray-800 p-6 shadow-lg ring-1 ring-gray-900/5'>
      <img className="mb-3" src={memory.picture_url}></img>
      <div className='flex justify-between items-start mb-2'>
        <p className='text-xl font-semibold text-white'>{memory.name}</p>
        {isCurrentUserAuthor && (
        <Dropdown theme={DropdownTheme} label='Settings' inline>
        <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
      </Dropdown>
      
          )}
      </div>
      
      <p className='text-xs font-semibold text-gray-300'>From {formatDate(new Date(memory.timestamp))}</p>,
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
          <div className='text-gray-200 italic'>
          Posted on {formatDate(new Date(memory.created_at))}
          </div>
        </div>
      </figcaption>
    </figure>
  )
}
