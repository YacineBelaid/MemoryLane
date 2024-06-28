// src/store/userStore.ts
import { create } from 'zustand'
import { CredentialResponse } from '@react-oauth/google'
interface UserState {
  userCredentials: CredentialResponse | null
  userName: string | null
  userEmail: string | null
  userPicture: string | null
  isAuthenticated: boolean
  openModal: boolean
  profileSettings: boolean
  memoryModal:boolean
  setMemoryModal: (memoryModal: boolean) => void
  setProfileSettings: (profileSettings: boolean) => void
  setOpenModal: (openModal: boolean) => void
  setUserCredentials: (credentials: CredentialResponse) => void
  setUserPicture: (name: string) => void
  setUserName: (name: string) => void
  setUserEmail: (email: string) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  login: (name: string, email:string,picture:string) => void
  logout: () => void
}

const useUserStore = create<UserState>((set) => ({
  userCredentials: null,
  userEmail: null,
  userName: null,
  userPicture: null,
  isAuthenticated: false,
  openModal:false,
  profileSettings:false,
  memoryModal:false,
  setMemoryModal: (memoryModal) => set({ memoryModal }),
  setProfileSettings: (profileSettings) => set({ profileSettings }),
  setUserName: (name) => set({ userName: name }),
  setUserEmail: (email) => set({ userEmail: email }),
  setUserPicture: (email) => set({ userEmail: email }),
  setUserCredentials: (credentials) => set({ userCredentials: credentials }),
  setOpenModal: (openModal) => set({ openModal }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  login: (name, email, picture) => set({ userName: name,userEmail: email, userPicture: picture, isAuthenticated: true }),
  logout: () => set({ userName: null, isAuthenticated: false }),
}))

export default useUserStore
