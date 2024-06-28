import { FriendModal } from "./../components/FriendModal";
import { ProfileSettingsModal } from "../components/ProfileSettingsModal";
import Mosaic from "./..//components/Mosaic";
import SpeedDial from "./../components/Speedial";
import { CreateMemory } from "./../components/CreateMemory";

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