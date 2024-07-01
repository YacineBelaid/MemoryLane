'use client'

import useUserStore from '../../store/useStore'
import { Button, FloatingLabel, Modal, Checkbox, TextInput } from 'flowbite-react'
import { FileInput, Label } from 'flowbite-react'
import { ChangeEvent, useState } from 'react'
import { getTheme } from '../../theme/themeUtils';
import { useMutation } from '@tanstack/react-query';
import { createMemory } from './../../services/memory.service'; 
import { CreateMemoryData } from '@/interfaces/memory.inteface'

export function CreateMemory() {
  const modal = getTheme("createMemory")
  const floatingLabel = getTheme("floatingLabel")
  const { memoryModal, setMemoryModal } = useUserStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [friendNames, setFriendNames] = useState('')
  const [fileType, setFileType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const createMemoryMutation = useMutation<unknown, Error, CreateMemoryData>({
    mutationFn: createMemory,
    onSuccess: () => {
      setMemoryModal(false);
      // You might want to refetch memories or update the UI here
    },
    onError: (error) => {
      console.error('Failed to create memory:', error);
    }
  });
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setFileType(e.target.files[0].type);
    }
  };
  
  const handleSubmit = () => {
    const friendIds = friendNames.split(',').map(name => name.trim()).filter(name => name !== '').map(Number);
    createMemoryMutation.mutate({
      name: title,
      description,
      isPublic,
      friendIds,
      filetype: fileType?.toString(),
      file: file,
    });
  };
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 50) {
      setTitle(input)
    }
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    if (input.length <= 500) {
      setDescription(input)
    }
  }

  return (
    <>
      <Modal theme={modal} show={memoryModal} onClose={() => setMemoryModal(false)}>
        <Modal.Header>Add Memory</Modal.Header>
        <Modal.Body>
          <div className='flex flex-col space-y-4 w-full'>
            {/* fileTypeupload section */}
            <div className='w-full'>
              <Label
                htmlFor='dropzone-file'
                className='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
              >
                {file? (
                  <img src={URL.createObjectURL(file)} alt="Uploaded" className="h-full w-full object-cover" />
                ) : (
                  <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                  <svg
                    className='mb-4 h-8 w-8 text-gray-500 dark:text-gray-400'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>
                  
                  <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='font-semibold'>Click to upload</span> or
                    drag and drop
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                )}
              </Label>
              <FileInput id='dropzone-file' className='hidden' onChange={handleFileChange} />
            </div>

            {/* Title input */}
            <FloatingLabel
              theme={floatingLabel}
              variant='filled'
              label='Title (not exceeding 50 characters)'
              helperText='Give a title to your memory'
              value={title}
              onChange={handleTitleChange}
              maxLength={50}
            />
            <div className='text-sm text-gray-400 mt-1'>
              {title.length}/{50} characters
            </div>

            {/* Description input */}
            <div className='relative'>
              <textarea
                id='description'
                className='peer block w-full appearance-none border-0 border-b-2  bg-gray-800 text-sm text-white focus:outline-none focus:ring-0 border-gray-600 focus:border-blue-500 min-h-[100px] px-0 py-2.5'
                placeholder=' '
                value={description}
                onChange={handleDescriptionChange}
                maxLength={500}
              ></textarea>
              <label
                htmlFor='description'
                className='absolute text-xs text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-0'
              >
                Description (not exceeding 500 characters)
              </label>
              <div className='text-sm text-gray-400 mt-1'>
                {description.length}/{500} characters
              </div>
            </div>

            {/* Public/Private toggle */}
            <div className="flex items-center">
              <Checkbox 
                id="isPublic" 
                checked={isPublic} 
                onChange={() => setIsPublic(!isPublic)} 
              />
              <Label htmlFor="isPublic" className="ml-2 text-gray-400 text-xs">Make this memory public</Label>
            </div>
            {/* Friend names input */}
            <TextInput
              id="friendNames"
              type="text"
              placeholder="Tag some friends (comma-separated)"
              value={friendNames}
              onChange={(e) => setFriendNames(e.target.value)}
              sizing={"sm"}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-end'>
          <Button color='green' onClick={handleSubmit} disabled={createMemoryMutation.isLoading}>
            <p className='text-gray'>{createMemoryMutation.isLoading ? 'Creating...' : 'Create'}</p>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}