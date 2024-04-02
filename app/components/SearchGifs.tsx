"use client";
import { FC, useState, FormEvent, Dispatch, SetStateAction } from "react";

import { GiphyImage } from "../page";

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

interface SearchGifsProps {
  setSearchResults: Dispatch<SetStateAction<GiphyImage[]>>;
}

const SearchGifs: FC<SearchGifsProps> = ({ setSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState("");

  function isMobileDevice() {
    const minWidth = 768; // Minimum width for desktop devices
    return window.innerWidth < minWidth || screen.width < minWidth;
  }

  function removeFocus(cssId: string) {
    // blurs the search input to hide keyboard on mobile after form submission
    document.getElementById(cssId)?.blur();
  }

  async function search(e: FormEvent) {
    console.log("form submitted");
    e.preventDefault();
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${searchQuery}&limit=30&offset=0&rating=g&lang=en`
    )
      .then((result) => result.json())
      .then((data) => {
        setSearchResults(data.data);
        console.log(data.data[0]);
      })
      .catch((err) => console.log(err));

    isMobileDevice() && removeFocus("searchGifId");
  }

  return (
    <>
      <div className="flex justify-center items-center p-8">
        <form
          className="flex items-center border-b border-teal-500 py-2"
          onSubmit={search}
        >
          <input
            id="searchGifId"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Search for your dream"
            aria-label="search-gif"
            value={searchQuery}
            autoFocus
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Search GIFs
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchGifs;
