import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import ReactModal from "react-modal";

type Friend = {
  id: number;
  name: string;
  email: string;
};

type FriendsModalProps = {
  modalChanger: (arg: boolean) => void;
  isOpen: boolean;
};

export default function FriendsModal({
  modalChanger,
  isOpen,
}: FriendsModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState<string>("");

  useEffect(() => {
    const fetchFriends = async () => {
      const friends = await getFriends();
      setFriends(friends);
    };

    fetchFriends();
  }, []);

  const getFriends = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userIdA = user.id;
    // const baseUrl = `${window.location.protocol}//${window.location.host}`;

    try {
      const response = await fetch(`/api/user/friends?id=${userIdA}`);
      if (!response.ok) {
        throw new Error();
      }
      const data: { friends: Friend[] } = await response.json();
      return data.friends;
    } catch (err) {
      console.log(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!emailInput.trim()) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userEmailA = user.email;

      const response = await fetch(`/api/user/friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emaila: userEmailA,
          emailb: emailInput.trim(),
        }),
      });
      if (!response.ok) {
        throw new Error("no new friend for you");
      }
      // const data = await response.json();
      const friends = await getFriends();
      setFriends(friends);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFriend = async (emailToRemove: string) => {
    if (!emailToRemove.trim()) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userEmailA = user.email;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    const response = await fetch(`${baseUrl}/api/user/friends`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emaila: userEmailA,
        emailb: emailToRemove.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove friend");
    }

    // const data = await response.json();

    const updatedFriends = await getFriends();
    setFriends(updatedFriends);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={() => modalChanger(false)}
      overlayClassName={styles["overlay"]}
      className={styles["content"]}
    >
      <div className={styles["letter"]}>
        <div className={styles["header"]}>
          <h1>Your Friends</h1>
        </div>
        <div className={styles["container"]}>
          <div className={styles["friends-col"]}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul className={styles["buttons"]}>
                {friends.map((friend) => (
                  <li key={friend.email} className="brown-button">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        <strong>{friend.name}</strong>
                        <br />
                        <span>{friend.email}</span>
                      </div>
                      <div style={{ flex: 0 }}>
                        <button
                          onClick={() => handleRemoveFriend(friend.email)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles["add-col"]}>
            <h2>Add Friend</h2>
            <div>
              <input
                className={styles["add-text-box"]}
                type="email"
                placeholder="Enter email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button onClick={handleAddFriend}> ➤ </button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
