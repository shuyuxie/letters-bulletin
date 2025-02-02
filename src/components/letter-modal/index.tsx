import { type Letter } from "@/models/Letter";
import ReactModal from "react-modal";
import styles from "./index.module.css";
import { useState } from "react";

interface Props extends Letter {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDelete?: () => void;
}

export default function LetterModal({
  _id,
  sender,
  content,
  date,
  isOpen,
  onBoard,
  setIsOpen,
  unseen,
  onDelete,
}: Props) {

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/letter?id=${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete letter');
      }

      setShowDeleteConfirm(false);
      setIsOpen(false);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting letter:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete letter');
      setShowError(true); // Show the error modal
      setShowDeleteConfirm(false);
    }
  };


  return (
    <>
    <ReactModal
      isOpen={isOpen}
      ariaHideApp={false}
      shouldCloseOnOverlayClick
      shouldFocusAfterRender={false}
      onRequestClose={() => setIsOpen(false)}
      overlayClassName={styles["overlay"]}
      className={styles["content"]}
    >
      <div className={styles["letter"]}>
        <div className={styles["header"]}>
          <h1>{sender}</h1>
          <h1>{new Date(date).toDateString()}</h1>
        </div>
        <div className="overflow-scroll h-full px-8">
          <p>{content}</p>
        </div>
      </div>
      <div className={styles["buttons"]}>
        {(!onBoard || unseen) && (
          <button className="purple-button">pin to board</button>
        )}
        <button className="brown-button">put in collection</button>
        <button 
          className="brown-button" 
          onClick={() => setShowDeleteConfirm(true)}>
          delete forever
        </button>
      </div>
    </ReactModal>
          <ReactModal
          isOpen={showDeleteConfirm}
          ariaHideApp={false}
          shouldCloseOnOverlayClick
          shouldFocusAfterRender={false}
          onRequestClose={() => setShowDeleteConfirm(false)}
          overlayClassName={styles["overlay"]}
          className={styles["content"]}
        >
          <div className={`${styles["letter"]} flex flex-col items-center justify-center p-8 text-center`}>
            <div className={styles["header"]}>
              <h1>Delete Letter</h1>
            </div>
            <div className="flex flex-col items-center justify-center space-y-6 px-8 py-12">
              <h2 className="text-2xl">Are you sure you want to delete this letter?</h2>
              <p className="text-xl opacity-75">This action cannot be undone.</p>
              <div className="flex gap-4 mt-8">
                <button 
                  className="brown-button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="purple-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ReactModal>
  
        <ReactModal
          isOpen={showError}
          ariaHideApp={false}
          shouldCloseOnOverlayClick
          shouldFocusAfterRender={false}
          onRequestClose={() => setShowError(false)}
          overlayClassName={styles["overlay"]}
          className={styles["content"]}
        >
          <div className={`${styles["letter"]} flex flex-col items-center justify-center p-8 text-center`}>
            <div className={styles["header"]}>
              <h1>Error</h1>
            </div>
            <div className="flex flex-col items-center justify-center space-y-6 px-8 py-12">
              <h2 className="text-2xl text-red-600">Something went wrong</h2>
              <p className="text-xl opacity-75">{errorMessage}</p>
              <div className="flex gap-4 mt-8">
                <button 
                  className="brown-button"
                  onClick={() => setShowError(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ReactModal>
    </>
  );
}
