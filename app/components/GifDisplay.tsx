"use client";
import { useState } from "react";
import Masonry from "react-responsive-masonry";

interface GiphyImage {
  id: string;
  images: {
    original: {
      url: string;
    };
  };
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function GifDisplay({
  userId,
  searchResults,
  setSearchResults,
  setStreak,
}) {
  const [selectedGif, setSelectedGif] = useState("");

  async function selectGif(gifUrl: string) {
    setSelectedGif(gifUrl);
    setSearchResults([]);
    // update streak on backend
    const currentDate = new Date().toISOString();
    fetch(`${SERVER_URL}/api/v1/users/${userId}/update-streak`, {
      method: "PATCH",
      body: JSON.stringify({ date: currentDate }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((result) => result.json())
      .then((data) => setStreak(data.streak))
      .catch((err) => console.log(err));
  }

  return (
    <>
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
          <div className="flex justify-center">
            <img
              src={selectedGif}
              className="max-w-lg border-dashed border-2 border-silver"
              alt="Selected Gif"
            />
          </div>
        )}
      </div>
    </>
  );
}