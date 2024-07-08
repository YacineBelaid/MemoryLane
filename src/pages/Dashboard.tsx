import { FriendModal } from "../components/Modals/FriendModal";
import { ProfileSettingsModal } from "../components/Modals/ProfileSettingsModal";
import Mosaic from "./..//components/Mosaic";
import SpeedDial from "./../components/Speedial";
import { CreateMemory } from "../components/Modals/CreateMemory";

export function Dashboard() {
  return (
    <>
    <SpeedDial/>
    <div className="flex flex-row">
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
    <Mosaic maxHeight="95vh" />
    <FriendModal/>
    <ProfileSettingsModal/>
    <CreateMemory/>
    </div>
    </div>
    </>
  )
}