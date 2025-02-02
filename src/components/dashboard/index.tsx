"use client";
import React from "react";
import Sidebar from "@/components/sidebar";
// import rebalanceZ from "./rebalance";
import { type Letter as LetterType } from "@/models/Letter";
import { useState, useEffect } from "react";
import Letter from "@/components/board-letter";
import styles from "./index.module.css";
import LetterModal from "../letter-modal";
import FriendsModal from "../friend-modal";
import NewLetterModal from "../modals/NewLetterModal";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const [friendModal, setFriendModal] = useState(false);
  const [newLetterModalOpen, setNewLetterModalOpen] = useState(false);
  const [collectionLetters, setCollectionLetters] = useState<LetterType[]>([]);
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      localStorage.setItem("user", JSON.stringify(session.user));
      const getLetters = async () => {
        const id = JSON.parse(localStorage.getItem("user") || "{}").id;
        const res = await fetch(`/api/user/${id}/letters`);
        const data = await res.json();
        const board = data.received.filter(
          (letter: LetterType) => letter.onBoard
        );
        const collection = data.received.filter(
          (letter: LetterType) => !letter.onBoard
        );
        setLetters(board);
        setCollectionLetters(collection);
      };
      getLetters();
    } else {
      localStorage.removeItem("user");
    }
  }, [session]);
  const handleLetterDelete = (_id: string) => {
    setLetters(letters.filter((letter) => letter._id !== _id));
  };

  const [letters, setLetters] = useState<LetterType[]>([]);
  const [topZ, setTopZ] = useState(0);
  const [modalLetter, setModalLetter] = useState<LetterType>({
    _id: "",
    sender: "",
    date: new Date(),
    unseen: false,
    onBoard: true,
    coordinates: { x: 0, y: 0, z: 0 },
    content: "",
  });
  const [letterModalOpen, setLetterModalOpen] = useState(false);

  useEffect(() => {
    if (!topZ)
      setTopZ(
        Math.max(0, ...letters.map((letter) => letter.coordinates.z)) + 1
      );
  }, [letters, topZ]);

  async function rebalance(newTopZ: number) {
    setTopZ(newTopZ + 1);
  }

  async function setCoords(id: string, newCoords: { x: number; y: number }) {
    setLetters(
      letters.map((letter) => {
        if (letter._id === id) {
          return {
            ...letter,
            coordinates: {
              ...letter.coordinates,
              x: newCoords.x,
              y: newCoords.y,
            },
          };
        }
        return letter;
      })
    );

    const letter = letters.find((letter) => letter._id === id);
    await fetch(`/api/letter`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        coordinates: { z: letter?.coordinates.z, ...newCoords },
      }),
    });
  }

  function openModal(id: string) {
    const letter = letters.find((letter) => letter._id === id);
    if (letter) setModalLetter(letter);
    setLetterModalOpen(true);
  }

  return (
    <>
      <div className="flex absolute">
        <Sidebar
          modalChanger={setFriendModal}
          openSendLetterModal={() => setNewLetterModalOpen(true)} // New prop
          collectionLetters={collectionLetters}
        />
        {friendModal ? <></> : <></>}
        <div>
          {letters.length ? (
            letters.map((letter, index) => (
              <Letter
                key={index}
                setCoords={setCoords}
                rebalance={rebalance}
                openModal={openModal}
                topZ={topZ}
                {...letter}
              />
            ))
          ) : (
            <div className={styles["empty"]}>
              <h1 className={styles["header"]}>your board is empty</h1>
              <h2 className={styles["sub"]}>
                open the sidebar to add new friends, write new letters, and view
                your collection
              </h2>
            </div>
          )}
        </div>
      </div>
      <LetterModal
        {...modalLetter}
        isOpen={letterModalOpen}
        setIsOpen={setLetterModalOpen}
        onDelete={() => handleLetterDelete(modalLetter._id)} // Pass the function
      />
      <FriendsModal modalChanger={setFriendModal} isOpen={friendModal} />
      <NewLetterModal // Render NewLetterModal
        isOpen={newLetterModalOpen}
        setIsOpen={setNewLetterModalOpen}
        userId={session?.user?.id || ""} // Pass the correct user ID
      />
    </>
  );
}
