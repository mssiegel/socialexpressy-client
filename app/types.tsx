export type Streak = "?" | number;

export type RequestStatus = "ERROR" | "PENDING" | "NONE" | "FINISHED";

export interface GiphyImage {
  id: string;
  images: {
    original: {
      webp: string;
    };
  };
}
