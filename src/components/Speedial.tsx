import { useState } from 'react'
import useUserStore from './../store/useStore'
export default function SpeedDial() {
  const [isOpen, setIsOpen] = useState(false)
  const { openModal, setOpenModal,memoryModal, setMemoryModal  } = useUserStore()
  return (
    <div
      className='fixed bottom-6 end-24 group z-50'
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={`flex flex-col items-center mb-4 space-y-2 ${
          isOpen ? '' : 'hidden'
        }`}
      >
        <button
          type='button'
          className='relative w-[60px] h-[60px] rounded-full border border-gray-600 shadow-sm hover:text-white text-gray-400 bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-400'
        >
          <button
            type='button'
            className='relative w-[60px] h-[60px] rounded-full border border-gray-600 shadow-sm hover:text-white text-gray-400 bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-400 flex items-center justify-center'
            onClick={() => {if(openModal == false ) {setOpenModal(true)}}}
          >
            <svg
              className='w-6 h-6 text-gray-400e'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fillRule='evenodd'
                d='M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z'
                clipRule='evenodd'
              />
            </svg>
            <span className=' bg-gray-600 absolute whitespace-nowrap px-2 py-1 text-sm text-white font-medium -translate-y-1/2 right-full mr-2 top-1/2 rounded-md'>
              add Friends
            </span>
          </button>

        </button>
        <button
          type='button'
          className='relative w-[60px] h-[60px] rounded-full border border-gray-600 shadow-sm hover:text-white text-gray-400 bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-400'
          onClick={() => {if(memoryModal == false ) {setMemoryModal(true)}}}
        >
          <svg
            className='w-5 h-5 mx-auto'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 18 20'
          >
            <path d='M5 9V4.13a2.96 2.96 0 0 0-1.293.749L.879 7.707A2.96 2.96 0 0 0 .13 9H5Zm11.066-9H9.829a2.98 2.98 0 0 0-2.122.879L7 1.584A.987.987 0 0 0 6.766 2h4.3A3.972 3.972 0 0 1 15 6v10h1.066A1.97 1.97 0 0 0 18 14V2a1.97 1.97 0 0 0-1.934-2Z' />
            <path d='M11.066 4H7v5a2 2 0 0 1-2 2H0v7a1.969 1.969 0 0 0 1.933 2h9.133A1.97 1.97 0 0 0 13 18V6a1.97 1.97 0 0 0-1.934-2Z' />
          </svg>
          <span className='absolute bg-gray-600 whitespace-nowrap px-2 py-1 text-sm text-white font-medium -translate-y-1/2 right-full mr-2 top-1/2  rounded-md'>
            add Posts
          </span>
        </button>
      </div>
      <button
        type='button'
        className='flex items-center justify-center text-white rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800'
      >
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-45' : ''
          }`}
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 18 18'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 1v16M1 9h16'
          />
        </svg>
        <span className='sr-only'>Open actions menu</span>
      </button>
    </div>
  )
}
