"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("/api/hello", { method: "GET" }).then((res) => res.json());
  }, []);
  return <p>homepage</p>;
}
