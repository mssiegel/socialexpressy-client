"use client";
import { FC, useState, Dispatch, SetStateAction } from "react";
import Masonry from "react-responsive-masonry";
import Image from "next/image";

import { GiphyImage, RequestStatus, Streak } from "../page";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface GifDisplayProps {
  userId: number;
  searchResults: GiphyImage[];
  setSearchResults: Dispatch<SetStateAction<GiphyImage[]>>;
  setStreak: Dispatch<SetStateAction<Streak>>;
  searchStatus: RequestStatus;
}

const GifDisplay: FC<GifDisplayProps> = ({
  userId,
  searchResults,
  setSearchResults,
  setStreak,
  searchStatus,
}) => {
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

  if (searchStatus === "PENDING")
    return <p className="text-center">Loading gifs</p>;
  if (searchStatus === "ERROR")
    return (
      <p className="text-center text-red-600">
        Error fetching gifs. Try again.
      </p>
    );
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <Masonry columnsCount={2} gutter="15px">
          {searchResults?.map((el: GiphyImage) => (
            <div key={el.id} className="">
              <Image
                src={el.images.original.url}
                alt="Sunset in the mountains"
                width={300}
                height={300}
                unoptimized
                onClick={() => selectGif(el.images.original.url)}
              />
            </div>
          ))}
        </Masonry>
        {selectedGif && (
          <div className="flex justify-center">
            <Image
              src={selectedGif}
              className="max-w-lg border-dashed border-2 border-silver"
              alt="Selected Gif"
              unoptimized
              width={500}
              height={500}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default GifDisplay;
