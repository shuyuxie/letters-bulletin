"use client";
import React, { useState, useEffect } from "react";
import styles from "./NewLetterModal.module.css";
import ReactModal from "react-modal";
import axios from "axios";

type Friend = {
  id: number;
  name: string;
  email: string;
};

type NewLetterModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userId: string;
};

export default function NewLetterModal({
  isOpen,
  setIsOpen,
  userId,
}: NewLetterModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`/api/user/friends?id=${userId}`);
        setFriends(response.data.friends || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  const handleSendLetter = async () => {
    if (!recipient.trim() || !content.trim()) {
      setError("Both recipient and content are required.");
      return;
    }

    try {
      await axios.post("/api/letter", {
        sender: userId,
        recipient,
        content,
        coordinates: { x: 0, y: 0, z: 0 },
      });

      alert("Letter sent successfully!");
      setIsOpen(false);
    } catch (err) {
      console.error("Error sending letter:", err);
      setError("Failed to send the letter. Please try again.");
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={() => setIsOpen(false)}
      overlayClassName={styles["overlay"]}
      className={styles["modal"]}
    >
      <div className={styles["letter"]}>
        <div className={styles["header"]}>
          <h1 className={styles["title"]}>Send a New Letter</h1>
        </div>
        <div className={styles["container"]}>
          <div>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={styles["select"]}
            >
              <option value="" disabled>
                Select a Friend
              </option>
              {friends.map((friend) => (
                <option key={friend.email} value={friend.email}>
                  {friend.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Write your letter here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles["textarea"]}
            />
            {error && <p className={styles["error"]}>{error}</p>}
            <button
              onClick={handleSendLetter}
              className={styles["submitButton"]}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
