import { Memory } from "./memory.inteface";

export interface User {
    id: string;
    name: string;
    email: string;
    picture: string;
  }
  
export interface UserState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean
    openModal: boolean
    profileSettings: boolean
    memoryModal:boolean
    openfriendDeleteModal:boolean
    openMemoryDeleteModal: boolean,
    memoryToEdit: Memory | null
    memoryToDeleteId: string | null
    setMemoryToEdit: (memory: Memory | null) => void
    setMemoryToDeleteId: (id: string | null) => void
    setopenMemoryDeleteModal: (openMemmoryDeleteModal: boolean) => void
    setopenFriendDeleteModal: (openfriendDeleteModal: boolean) => void
    setMemoryModal: (memoryModal: boolean) => void
    setProfileSettings: (profileSettings: boolean) => void
    setOpenModal: (openModal: boolean) => void
    setIsAuthenticated: (isAuthenticated: boolean) => void
    login: (token: string, user: User) => void;
    logout: () => void
  }
   
export interface UserPictureAndName {
    name: string;
    picture_link: string;
  }
  