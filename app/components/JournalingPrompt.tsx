"use client";
import { FC, useEffect, useState } from "react";

const journalingQuestions = [
  "What's a mistake that taught me empathy?",
  "What's a new way I can challenge myself?",
  "What's a thought that's been holding me back?",
  "What's a fear that no longer controls me?",
  "What's a lesson from a difficult experience?",
  "What's something I've done that surprised me?",
  "What's a worry that turned out to be unfounded?",
  "What's a value I want to live by?",
  "What's a way I've shown kindness today?",
  "What's a book that opened my mind?",
  "What's a goal I've set for the next month?",
  "What's something I've forgiven myself for?",
  "What's a belief I've let go of?",
  "What's a way I've grown emotionally?",
  "What's something I've done that made me proud?",
  "What's a friendship I've deepened?",
  "What's a mistake that led to a new opportunity?",
  "What's a dream I've never shared with anyone?",
  "What's a new experience I want to try?",
  "What's a fear I'm ready to confront?",
  "What's a lesson from a difficult decision?",
  "What's something I'm excited to try?",
  "What's a worry that's holding me back?",
  "What's a belief that limits me?",
  "What's a value I want to instill in others?",
  "What's a way I've shown gratitude today?",
  "What's a book that changed my life?",
  "What's a goal I'm committed to achieving?",
  "What's a habit I'm proud to have developed?",
  "What's something I've let go of and why?",
  "What's a belief I've challenged?",
];

const JournalingPrompt: FC = () => {
  const [todaysQuestion, setTodaysQuestion] = useState(getTodaysQuestion());

  useEffect(() => {
    /* This "visibilitychange" event listener will update the daily question when user
       minifies the app on their device and then reopens it the next day */
    document.addEventListener("visibilitychange", ensureCorrectQuestion);

    function ensureCorrectQuestion() {
      if (document.visibilityState === "visible")
        setTodaysQuestion(getTodaysQuestion());
    }

    return () =>
      document.removeEventListener("visibilitychange", ensureCorrectQuestion);
  }, []);

  function getTodaysQuestion() {
    // Their are 31 journaling questions, one for each day of the month
    const dayOfMonth = new Date().getDate();
    return journalingQuestions[dayOfMonth - 1];
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <p className="text-center font-sans font-bold text-violet-600 text-2xl">
          {todaysQuestion}
        </p>
      </div>
    </>
  );
};

export default JournalingPrompt;
