import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { getMemories } from './../services/memory.service'
import { Memory, SortBy, QueryType } from '@/interfaces/memory.inteface'
import { MemoryCard } from './MemoryCard'
import useUserStore from './../store/useStore'
import { MemoryDelete } from './Modals/MemoryDeleteModal'
import { Button, Select } from 'flowbite-react'
import { buttonSelect } from './../theme/buttonGroups'
import { button } from './../theme/button'
import {sortByTheme} from './../theme/seleect'
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

export default function Mosaic({ maxHeight = '80vh' }) {
  const [currentDate, setCurrentDate] = useState<string>('')
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<number | null>(null)
  const [queryType, setQueryType] = useState<QueryType>('public')
  const [sortBy, setsortBy] = useState<SortBy>('latest')
  const {
    data: memories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['memories', queryType],
    queryFn: () => getMemories({ queryType }),
  })

  const { user } = useUserStore()

  const getDateIndicatorPosition = () => {
    const minPosition = 15
    const maxPosition = 85
    const calculatedPosition = scrollPercentage * 100
    return `${Math.min(
      Math.max(calculatedPosition, minPosition),
      maxPosition
    )}%`
  }
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as Error).message}</div>
  return (
    <>
      <div className='flex flex-wrap gap-2 justify-center items-center w-full'>
        <Button.Group theme={buttonSelect}>
          <Button
            theme={button}
            color={queryType === 'public' ? 'gray' : 'dark'}
             className={queryType === 'public' ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}
            onClick={() => setQueryType('public')}
          >
            Public Feed
          </Button>
          <Button
            theme={button}
            color={queryType === 'friend_all_feed' ? 'gray' : 'dark'}
             className={queryType === 'friend_all_feed' ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}
            onClick={() => setQueryType('friend_all_feed')}
          >
            Friends Feed
          </Button>
          <Button
            theme={button}
            color={queryType === 'user_all' ? 'blue' : 'dark'}
             className={queryType === 'user_all' ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}
            onClick={() => setQueryType('user_all')}
          >
            Personal Feed
          </Button>
        </Button.Group>
      </div>
      <div className='flex flex-wrap gap-2 pt-3 justify-center items-center w-full text-gray-300'>
        <select id='sortBy' className='"border border-transparent   border-gray-700 bg-gray-800 focus:ring-gray-800 enabled:hover:bg-gray-700"'>
          <option className='"border border-transparent   border-gray-700 bg-gray-800 focus:ring-gray-800 enabled:hover:bg-gray-700"'>Latest post</option>
          <option className="border border-transparent   border-gray-700 bg-gray-800 focus:ring-gray-800 enabled:hover:bg-gray-700">Oldest post</option>
          <option className="border border-transparent   border-gray-700 bg-gray-800 focus:ring-gray-800 enabled:hover:bg-gray-700">Latest memory</option>
          <option className="border border-transparent   border-gray-700 bg-gray-800 focus:ring-gray-800 enabled:hover:bg-gray-700">Oldest memory</option>
        </select>
      </div>
      <div
        className='relative isolate pb-8 pt-8 sm:pt-12 Flipped'
        style={{ maxHeight, overflow: 'hidden' }}
      >
        <div
          ref={scrollContainerRef}
          className='overflow-y-auto relative'
          style={{ maxHeight: `calc(${maxHeight} - 3rem)` }}
        >
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-xl text-center mb-8'>
              <h2 className='text-lg font-semibold leading-8 tracking-tight text-white'>
                {formatDate(new Date())}
              </h2>
              <p className='mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                Latest shared memory
              </p>
            </div>

            <div
              className='grid gap-8 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1'
              style={{ direction: 'ltr' }}
            >
              {memories?.map((memory: Memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  currentUser={user}
                />
              ))}
            </div>
          </div>
        </div>

        {isScrolling && (
          <div
            className='absolute left-0 bg-gray-800 text-white px-3 py-1 rounded-r-full transform -translate-y-1/2 z-10 transition-opacity duration-300'
            style={{
              top: getDateIndicatorPosition(),
              left: '2px',
              opacity: isScrolling ? 1 : 0,
            }}
          >
            {currentDate}
          </div>
        )}
        <MemoryDelete />
      </div>
    </>
  )
}
