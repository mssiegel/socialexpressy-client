"use client";
import {
  FC,
  FormEvent,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import Cookies from "js-cookie";

import {
  loginAPICall,
  retrieveUserJournalData,
  updateJournal,
} from "../journalServiceAPI";
import { Streak } from "../types";

interface SigninButtonsProps {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  selectedGif: string;
  setSelectedGif: Dispatch<SetStateAction<string>>;
  setStreak: Dispatch<SetStateAction<Streak>>;
}

enum status {
  loggedOut = "LOGGED_OUT",
  loggedIn = "LOGGED_IN",
  signingUp = "SIGNING_UP",
  loggingIn = "LOGGING_IN",
  loggingOut = "LOGGING_OUT",
}

const SigninButtons: FC<SigninButtonsProps> = ({
  userId,
  setUserId,
  selectedGif,
  setSelectedGif,
  setStreak,
}) => {
  const [loginStatus, setLoginStatus] = useState<status>(status.loggedOut);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) setLoginStatus(status.loggedIn);
  }, [userId]);

  const loginButton = () => (
    <button
      className="bg-violet-600 hover:bg-violet-800 text-sm text-white py-2 px-3 rounded"
      type="submit"
      onClick={() => setLoginStatus(status.loggingIn)}
    >
      Login
    </button>
  );

  async function login(e: FormEvent) {
    e.preventDefault();
    const userId = await loginAPICall(firstName, lastName, setError);
    if (!userId) {
      console.log("Login attempt failed");
      return;
    }

    const ONE_YEAR = 365;
    Cookies.set("userId", userId, { expires: ONE_YEAR });

    if (selectedGif) await updateJournal(userId, selectedGif, setStreak);

    setUserId(String(userId));
    setLoginStatus(status.loggedIn);
    // we retrieve the user journal data *AFTER* updating our journal. This is so
    // that we will automatically fetch the latest updated journal for the user
    retrieveUserJournalData(String(userId), setStreak, setSelectedGif);
  }

  const loginForm = () => (
    <form className="flex flex-col border-4 p-3" onSubmit={login}>
      <p className="font-bold mb-4">Login to track your daily streak</p>
      <label htmlFor="firstName">First name:</label>
      <input
        name="firstName"
        autoComplete="off"
        className="rounded-sm border border-slate-600 mb-2 pl-3"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <label htmlFor="lastName">Last name:</label>
      <input
        name="lastName"
        autoComplete="off"
        className="rounded-sm border border-slate-600 mb-2 pl-3"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <p className="text-red-600 mb-2">{error}</p>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-800 text-sm text-white py-2 px-3 rounded"
        >
          Login
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div className="flex justify-center mt-5">
        {loginStatus === status.loggedOut && loginButton()}
        {loginStatus === status.loggingIn && loginForm()}
      </div>
    </>
  );
};

export default SigninButtons;
