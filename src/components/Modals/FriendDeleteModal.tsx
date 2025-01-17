
"use client";

import useUserStore from "./../../store/useStore";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export function FriendDelete() {
  const {
    openfriendDeleteModal,
    setopenFriendDeleteModal,
  } = useUserStore()
  return (
    <>
      <Modal show={openfriendDeleteModal} size="md" onClose={() => setopenFriendDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this friend?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => setopenFriendDeleteModal(false)}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setopenFriendDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
