import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { getMemories } from './../services/memory.service';
import { Memory } from '@/interfaces/memory.inteface';
import {MemoryCard} from './MemoryCard';
import  useUserStore  from './../store/useStore';
import { MemoryDelete } from './Modals/MemoryDeleteModal';
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
  const [queryType, setQueryType] = useState('public')
  const { data: publicMemories, isLoading, error } = useQuery({
    queryKey: ['publicMemories'],
    queryFn: () => getMemories({ queryType: 'public' }),
  });
  const {user} = useUserStore()
  console.log(user)
  const updateScrollInfo = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current
      const newScrollPercentage = scrollTop / (scrollHeight - clientHeight)
      setScrollPercentage(newScrollPercentage)

      const allDates = publicMemories.flat(3).map((memory : Memory) => {
      if(queryType === 'public')
         new Date(memory.timestamp)
      if(queryType === 'public')
        new Date(memory.created_at)
      })
      const sortedDates = allDates.sort((a: { getTime: () => number; }, b: { getTime: () => number; }) => b.getTime() - a.getTime())
      const dateIndex = Math.floor(
        newScrollPercentage * (sortedDates.length - 1)
      )
      setCurrentDate(formatDate(sortedDates[dateIndex]))

      setIsScrolling(true)

      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false)
      }, 350)
    }
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateScrollInfo)
      return () => {
        scrollContainer.removeEventListener('scroll', updateScrollInfo)
        if (scrollTimeoutRef.current !== null) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }
  }, [])

  const getDateIndicatorPosition = () => {
    const minPosition = 15
    const maxPosition = 85
    const calculatedPosition = scrollPercentage * 100
    return `${Math.min(
      Math.max(calculatedPosition, minPosition),
      maxPosition
    )}%`
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  return (
    <div className="relative isolate pb-8 pt-8 sm:pt-12 Flipped" style={{ maxHeight, overflow: 'hidden' }}>
    <div
      ref={scrollContainerRef}
      className="overflow-y-auto relative"
      style={{ maxHeight: `calc(${maxHeight} - 3rem)` }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center mb-8">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-white">
            {formatDate(new Date())}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Latest shared memory
          </p>
        </div>

        <div
          className="grid gap-8 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"
          style={{ direction: 'ltr' }}
        >
          {publicMemories?.map((memory : Memory) => (
            <MemoryCard key={memory.id} memory={memory} currentUser={user} />
          ))}
        </div>
      </div>
    </div>

    {isScrolling && (
      <div
        className="absolute left-0 bg-gray-800 text-white px-3 py-1 rounded-r-full transform -translate-y-1/2 z-10 transition-opacity duration-300"
        style={{
          top: getDateIndicatorPosition(),
          left: '2px',
          opacity: isScrolling ? 1 : 0,
        }}
      >
        {currentDate}
      </div>
    )}
    <MemoryDelete/>
  </div>
)
}