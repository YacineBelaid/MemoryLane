import { create } from 'zustand'
import { User, UserState } from '../interfaces/user.interface'
import { persist } from 'zustand/middleware'
import { Memory } from '@/interfaces/memory.inteface'

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      openModal: false,
      profileSettings: false,
      memoryModal: false,
      openfriendDeleteModal: false,
      openMemoryDeleteModal: false,
      memoryToEdit: null,
      memoryToDeleteId: null,
      setMemoryToEdit: (memory: Memory | null) => set({ memoryToEdit: memory }),
      setMemoryToDeleteId: (id: string | null) => set({ memoryToDeleteId: id }),
      setopenMemoryDeleteModal: (openMemoryDeleteModal: boolean) => set({ openMemoryDeleteModal }),
      setopenFriendDeleteModal: (openfriendDeleteModal: boolean) => set({ openfriendDeleteModal }),
      setMemoryModal: (memoryModal: boolean) => set({ memoryModal }),
      setProfileSettings: (profileSettings: boolean) => set({ profileSettings }),
      setOpenModal: (openModal: boolean) => set({ openModal }),
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      login: (token: string, user: User) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
)

export default useUserStore
