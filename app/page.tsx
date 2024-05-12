"use client";
import { FC, useEffect, useState } from "react";
import Cookies from "js-cookie";

import JournalingPrompt from "./components/JournalingPrompt";
import SearchGifs from "./components/SearchGifs";
import GifDisplay from "./components/GifDisplay";
import SigninButtons from "./components/SigninButtons";
import { retrieveUserJournalData } from "./journalServiceAPI";
import { GiphyImage, RequestStatus, Streak } from "./types";

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
