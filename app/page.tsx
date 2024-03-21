"use client"; // TODO: investigate whether this 'use client' is necessary
import Masonry from "react-responsive-masonry";

import { useState } from "react";

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

interface GiphyImage {
  id: string;
  images: {
    original: {
      url: string;
    };
  };
}

export default function Home() {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);

  const handleSearch = () => {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${input}&limit=30&offset=0&rating=g&lang=en`
    )
      .then((result) => result.json())
      .then((data) => {
        setData(data.data);
        console.log(data.data[0]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <main>
      <div>
        <p className="text-center font-sans font-bold text-violet-600 text-2xl">
          This is one of my dreams:
        </p>

        <div className="flex justify-center items-center p-8">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Search for your dream"
              aria-label="search-gif"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
              onClick={handleSearch}
            >
              Search GIFs
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Masonry columnsCount={2} gutter="15px">
            {data?.map((el: GiphyImage) => (
              <div key={el.id} className="">
                <img
                  src={el.images.original.url}
                  alt="Sunset in the mountains"
                />
              </div>
            ))}
          </Masonry>
        </div>
      </div>
    </main>
  );
}
