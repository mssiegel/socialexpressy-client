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
      webp: string;
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
    /* This "visibilitychange" event listener will retrieve the user's journaling data
       when the user minifies the app on their device and then reopens it later */
    document.addEventListener("visibilitychange", retrieveJournalData);

    function retrieveJournalData() {
      if (document.visibilityState === "visible") retrieveUserJournalData;
    }

    return () =>
      document.removeEventListener("visibilitychange", retrieveJournalData);
  }, []);

  useEffect(() => {
    // retrieve a users journal data whenever the logged-in user changes
    retrieveUserJournalData();
  }, [userId]);

  function retrieveUserJournalData() {
    // retrieve the logged in user's streak and last journal entry
    if (!userId) return;

    const currentDate = new Date();
    const dateParams = new URLSearchParams({
      date: currentDate.toISOString(),
    }).toString();
    fetch(`${SERVER_URL}/api/v1/users/${userId}/journal?${dateParams}`)
      .then((result) => result.json())
      .then((data) => {
        console.log(data);
        setStreak(data.streak);
        if (isSameDay(currentDate, new Date(data.lastJournalDate)))
          // if the user already journaled today, then display the user's last journal entry
          setSelectedGif(data.lastGifUsed);
      })
      .catch((err) => console.log(err));
  }

  function isSameDay(date1: Date, date2: Date) {
    // checks if two dates are the same day
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

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
