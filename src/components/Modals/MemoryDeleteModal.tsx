"use client";

import { useState } from "react";
import useUserStore from "./../../store/useStore";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { deleteMemory } from "./../../services/memory.service"

export function MemoryDelete() {
  const {
    openMemoryDeleteModal,
    setopenMemoryDeleteModal,
    memoryToDeleteId,
    setMemoryToDeleteId,
  } = useUserStore();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!memoryToDeleteId) return;

    setIsDeleting(true);
    try {
      await deleteMemory(memoryToDeleteId);
      setopenMemoryDeleteModal(false);
      setMemoryToDeleteId(null);
    } catch (error) {
      console.error("Error deleting memory:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal 
        show={openMemoryDeleteModal} 
        size="md" 
        onClose={() => setopenMemoryDeleteModal(false)} 
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Memory?
            </h3>
            <div className="flex justify-center gap-4">
              <Button 
                color="failure" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, I'm sure"}
              </Button>
              <Button 
                color="gray" 
                onClick={() => setopenMemoryDeleteModal(false)}
                disabled={isDeleting}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
