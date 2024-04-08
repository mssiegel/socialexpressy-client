"use client";
import { FC, useEffect, useState } from "react";
import JournalingPrompt from "./components/JournalingPrompt";
import SearchGifs from "./components/SearchGifs";
import GifDisplay from "./components/GifDisplay";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface GiphyImage {
  id: string;
  images: {
    original: {
      url: string;
    };
  };
}
export type Streak = "?" | number;
export type RequestStatus = "ERROR" | "PENDING" | "NONE" | "FINISHED";

const Home: FC = () => {
  console.log("rendering home");
  const [streak, setStreak] = useState<Streak>("?");
  const [searchResults, setSearchResults] = useState<GiphyImage[]>([]);
  const [searchStatus, setSearchStatus] = useState<RequestStatus>("NONE");
  const userId = 1; // for user Moshe Siegel

  useEffect(() => {
    // display the user's streak on page load
    const currentDate = new Date().toISOString();
    const dateParams = new URLSearchParams({ date: currentDate }).toString();
    fetch(`${SERVER_URL}/api/v1/users/${userId}/streak?${dateParams}`)
      .then((result) => result.json())
      .then((data) => setStreak(data.streak))
      .catch((err) => console.log(err));
  }, []);

  return (
    <main>
      <JournalingPrompt />
      <SearchGifs
        setSearchResults={setSearchResults}
        setSearchStatus={setSearchStatus}
      />
      <GifDisplay
        userId={userId}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        setStreak={setStreak}
        searchStatus={searchStatus}
      />
      <p className="text-center">daily streak: {streak}</p>
    </main>
  );
};

export default Home;
