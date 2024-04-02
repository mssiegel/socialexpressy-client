"use client";
import { FC, useEffect, useState } from "react";
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

const Home: FC = () => {
  console.log("rendering home");
  const [streak, setStreak] = useState<Streak>("?");
  const [searchResults, setSearchResults] = useState<GiphyImage[]>([]);
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
      <div>
        <p className="text-center font-sans font-bold text-violet-600 text-2xl">
          This is one of my dreams:
        </p>

        <SearchGifs setSearchResults={setSearchResults} />
        <GifDisplay
          userId={userId}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          setStreak={setStreak}
        />
        <p className="text-center">daily streak: {streak}</p>
      </div>
    </main>
  );
};

export default Home;
