import React, { useEffect, useRef, useState } from "react";
import { type Letter } from "@/models/Letter";
import styles from "./index.module.css";

interface Props extends Letter {
  rebalance: (newZ: number) => void;
  setCoords: (id: string, offset: { x: number; y: number }) => void;
  openModal: (id: string) => void;
  topZ: number;
}

export default function BoardLetter({
  _id,
  sender,
  content,
  date,
  coordinates,
  topZ,
  rebalance,
  setCoords,
  openModal,
}: Props) {
  const { x, y, z: _z } = coordinates;
  const dragArea = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [z, setZ] = useState(_z);

  useEffect(() => {
    // lock in the width of the letter to prevent it from changing when dragging
    if (!dragArea.current) return;
    const width = dragArea.current?.offsetWidth;
    dragArea.current.childNodes.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.style.width = `${width}px`;
      }
    });
  }, [dragArea]);

  async function handleMouseDown(event: React.MouseEvent) {
    if (dragArea.current) {
      const rect = dragArea.current.getBoundingClientRect();
      setOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      setIsDragging(true);
      setZ(topZ);
    }
  }

  function handleMouseMove(event: React.MouseEvent) {
    if (isDragging) {
      if (dragArea.current) {
        dragArea.current.style.left = `${event.clientX - offset.x}px`;
        dragArea.current.style.top = `${event.clientY - offset.y}px`;
      }
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
    const rect = dragArea.current?.getBoundingClientRect();

    setCoords(_id, {
      x: rect?.left || x,
      y: rect?.top || y,
    });
    rebalance(z);
  }

  return (
    <div
      ref={dragArea}
      className={styles.letter}
      style={{ left: `${x}px`, top: `${y}px`, zIndex: z }}
    >
      <div
        className={styles.heading}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <p>{sender}</p>
        <p>{new Date(date).toDateString()}</p>
      </div>
      <div className={styles["content"]} onClick={() => openModal(_id)}>
        <p className="line-clamp-[12]">{content}</p>
      </div>
    </div>
  );
}
