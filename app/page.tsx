"use client"; // TODO: investigate whether this 'use client' is necessary
import Masonry from "react-responsive-masonry";
import { useEffect, useState } from "react";
import SearchGifs from "./components/SearchGifs";

interface GiphyImage {
  id: string;
  images: {
    original: {
      url: string;
    };
  };
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function Home() {
  console.log("rendering home");
  const [streak, setStreak] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGif, setSelectedGif] = useState("");
  const userId = 1; // for user Moshe Siegel

  useEffect(() => {
    // immediately show the user streak on page load
    const currentDate = new Date().toISOString();
    const dateParams = new URLSearchParams({ date: currentDate }).toString();
    fetch(`${SERVER_URL}/api/v1/users/${userId}/streak?${dateParams}`)
      .then((result) => result.json())
      .then((data) => setStreak(data.streak))
      .catch((err) => console.log(err));
  }, []);

  async function selectGif(gifUrl: string) {
    setSelectedGif(gifUrl);
    setSearchResults([]);
    // update query on backend
    const currentDate = new Date().toISOString();
    fetch(`${SERVER_URL}/api/v1/users/${userId}/update-streak`, {
      method: "PATCH",
      body: JSON.stringify({ date: currentDate }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((result) => result.json())
      .then((data) => setStreak(data.streak))
      .catch((err) => console.log(err));
  }

  return (
    <main>
      <div>
        <p className="text-center font-sans font-bold text-violet-600 text-2xl">
          This is one of my dreams:
        </p>

        <SearchGifs setSearchResults={setSearchResults} />

        <div className="max-w-2xl mx-auto">
          <Masonry columnsCount={2} gutter="15px">
            {searchResults?.map((el: GiphyImage) => (
              <div key={el.id} className="">
                <img
                  src={el.images.original.url}
                  alt="Sunset in the mountains"
                  onClick={() => selectGif(el.images.original.url)}
                />
              </div>
            ))}
          </Masonry>
          {selectedGif && (
            <div>
              <img src={selectedGif} alt="Sunset in the mountains" />
            </div>
          )}

          <p className="text-right">streak: {streak}</p>
        </div>
      </div>
    </main>
  );
}
