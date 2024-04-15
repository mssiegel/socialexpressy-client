"use client";
import { FC, useEffect, useState } from "react";
import Cookies from "js-cookie";

import JournalingPrompt from "./components/JournalingPrompt";
import SearchGifs from "./components/SearchGifs";
import GifDisplay from "./components/GifDisplay";
import SigninButtons from "./components/SigninButtons";

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
  const [selectedGif, setSelectedGif] = useState("");
  const [userId, setUserId] = useState(""); //

  useEffect(() => {
    const savedUserId = Cookies.get("userId");
    if (savedUserId) setUserId(savedUserId);
    // setUserId(1) // uncomment to automatically login as user 1 Moshe Siegel
  }, []);

  useEffect(() => {
    // display the logged in user's streak on page load or when user logs in
    if (!userId) return;

    const currentDate = new Date().toISOString();
    const dateParams = new URLSearchParams({ date: currentDate }).toString();
    fetch(`${SERVER_URL}/api/v1/users/${userId}/streak?${dateParams}`)
      .then((result) => result.json())
      .then((data) => setStreak(data.streak))
      .catch((err) => console.log(err));
  }, [userId]);

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
        selectedGif={selectedGif}
        setSelectedGif={setSelectedGif}
      />
      {userId && <p className="text-center">daily streak: {streak}</p>}
      <SigninButtons
        userId={userId}
        setUserId={setUserId}
        selectedGif={selectedGif}
        setStreak={setStreak}
      />
    </main>
  );
};

export default Home;
