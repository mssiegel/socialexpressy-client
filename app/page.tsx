"use client";
import { FC, useEffect, useState, Dispatch, SetStateAction } from "react";
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
      webp: string;
    };
  };
}
export type Streak = "?" | number;
export type RequestStatus = "ERROR" | "PENDING" | "NONE" | "FINISHED";

export function retrieveUserJournalData(
  userId: string,
  setStreak: Dispatch<SetStateAction<Streak>>,
  setSelectedGif: Dispatch<SetStateAction<string>>
) {
  // retrieve the logged in user's streak and last journal entry
  const currentDate = new Date();
  const dateParams = new URLSearchParams({
    date: currentDate.toISOString(),
  }).toString();
  fetch(`${SERVER_URL}/api/v1/users/${userId}/journal?${dateParams}`)
    .then((result) => result.json())
    .then((data) => {
      setStreak(data.streak);
      if (isSameDay(currentDate, new Date(data.lastJournalDate)))
        // if the user already journaled today, then display the user's last journal entry
        setSelectedGif(data.lastGifUsed);
    })
    .catch((err) => console.log(err));

  function isSameDay(date1: Date, date2: Date) {
    // checks if two dates are the same day
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}

const Home: FC = () => {
  console.log("rendering home");
  const [streak, setStreak] = useState<Streak>("?");
  const [searchResults, setSearchResults] = useState<GiphyImage[]>([]);
  const [searchStatus, setSearchStatus] = useState<RequestStatus>("NONE");
  const [selectedGif, setSelectedGif] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // retrieves the logged in users' journal data on page load
    const loggedInUserId = Cookies.get("userId");
    if (loggedInUserId) {
      setUserId(loggedInUserId);
      retrieveUserJournalData(loggedInUserId, setStreak, setSelectedGif);
    }
  }, []);

  useEffect(() => {
    /* This "visibilitychange" event listener will retrieve the user's journaling data
       when the user minifies the app on their device and then reopens it later */
    document.addEventListener("visibilitychange", retrieveJournalData);

    function retrieveJournalData() {
      if (document.visibilityState === "visible") retrieveUserJournalData;
    }

    return () =>
      document.removeEventListener("visibilitychange", retrieveJournalData);
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
        selectedGif={selectedGif}
        setSelectedGif={setSelectedGif}
      />
      {userId && <p className="text-center">daily streak: {streak}</p>}
      <SigninButtons
        userId={userId}
        setUserId={setUserId}
        selectedGif={selectedGif}
        setSelectedGif={setSelectedGif}
        setStreak={setStreak}
      />
    </main>
  );
};

export default Home;
