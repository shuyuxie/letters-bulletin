"use client";
import React, { useState } from "react";
import {
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import SignOut from "../sign-out";
import styles from "./index.module.css";
import { Letter } from "@/models/Letter";

type SidebarProps = {
  modalChanger: (arg: boolean) => void;
  openSendLetterModal: () => void;
  collectionLetters: Letter[];
};

export default function Sidebar({
  modalChanger,
  openSendLetterModal,
  collectionLetters,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false); // New state for Collection dropdown

  return (
    <div className="flex absolute z-[2000]">
      <div className={isOpen ? styles["expanded-sidebar"] : "hidden"}>
        <h1 className={styles.title}>bulletin</h1>
        <nav className={styles["sidebar-content"]}>
          <ul>
            <li
              className={styles["sidebar-link"]}
              onClick={openSendLetterModal}
            >
              send a letter
            </li>
            <li
              className={styles["sidebar-link"]}
              onClick={() => modalChanger(true)}
            >
              friends list
            </li>
            <li
              className={styles["sidebar-link"]}
              onClick={() => setIsCollectionOpen(!isCollectionOpen)}
            >
              collection{" "}
              {isCollectionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </li>
            {isCollectionOpen && (
              <ul className={styles["dropdown"]}>
                {collectionLetters.map((letter, index) => (
                  <li key={index} className={styles["dropdown-item"]}>
                    {letter.sender}
                  </li>
                ))}
              </ul>
            )}
          </ul>
          <div className={styles["sidebar-footer"]}>
            <SignOut />
          </div>
        </nav>
      </div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={styles["sidebar-toggle"]}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </div>
  );
}
