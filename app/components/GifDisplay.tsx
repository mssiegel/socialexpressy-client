"use client";
import { FC, Dispatch, SetStateAction } from "react";
import Masonry from "react-responsive-masonry";
import Image from "next/image";

import { updateJournal } from "../journalServiceAPI";
import { GiphyImage, RequestStatus, Streak } from "../types";

interface GifDisplayProps {
  userId: string;
  searchResults: GiphyImage[];
  setSearchResults: Dispatch<SetStateAction<GiphyImage[]>>;
  setStreak: Dispatch<SetStateAction<Streak>>;
  searchStatus: RequestStatus;
  selectedGif: string;
  setSelectedGif: Dispatch<SetStateAction<string>>;
}

const GifDisplay: FC<GifDisplayProps> = ({
  userId,
  searchResults,
  setSearchResults,
  setStreak,
  searchStatus,
  selectedGif,
  setSelectedGif,
}) => {
  function selectGif(gifUrl: string) {
    setSelectedGif(gifUrl);
    setSearchResults([]);
    if (!userId) return;
    updateJournal(userId, gifUrl, setStreak);
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
                src={el.images.original.webp}
                alt="Sunset in the mountains"
                width={300}
                height={300}
                unoptimized
                onClick={() => selectGif(el.images.original.webp)}
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
