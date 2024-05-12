import { Dispatch, SetStateAction } from "react";

import { Streak } from "./types";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

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

export async function updateJournal(
  userId: string,
  gifUrl: string,
  setStreak: Dispatch<SetStateAction<Streak>>
) {
  // informs backend database that user journaled today
  const currentDate = new Date().toISOString();
  await fetch(`${SERVER_URL}/api/v1/users/${userId}/journal`, {
    method: "PATCH",
    body: JSON.stringify({ date: currentDate, lastGifUsed: gifUrl }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((result) => result.json())
    .then((data) => setStreak(data.streak))
    .catch((err) => console.log(err));
}

export async function loginAPICall(
  firstName: string,
  lastName: string,
  setError: Dispatch<SetStateAction<string>>
) {
  const loginResponse = await fetch(`${SERVER_URL}/api/v1/users/login`, {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });

  if (loginResponse.status === 404) {
    setError(
      `User not found; check spelling or ask Moshe Siegel to create you an account`
    );
    return null;
  }

  const { userId } = await loginResponse.json();
  return userId;
}
