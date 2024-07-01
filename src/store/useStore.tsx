// src/store/userStore.ts
import { create } from 'zustand'
import { UserState } from '../interfaces/user.interface'
import { persist } from 'zustand/middleware'

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
      openMemmoryDeleteModal: false,
      setopenMemmoryDeleteModal: (openMemmoryDeleteModal) => set({ openMemmoryDeleteModal }),
      setopenFriendDeleteModal: (openfriendDeleteModal) => set({ openfriendDeleteModal }),
      setMemoryModal: (memoryModal) => set({ memoryModal }),
      setProfileSettings: (profileSettings) => set({ profileSettings }),
      setOpenModal: (openModal) => set({ openModal }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
)

export default useUserStore
