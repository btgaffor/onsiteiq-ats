import { DBSchema } from "idb";

// partial implementation of resonse from randomuser.me
export interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
  registered: {
    date: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    postcode: number;
  };
  gender: string;
  dob: {
    age: number;
  }
}

export interface Candidate {
  id?: number;
  status: "pending" | "approved" | "rejected";
  note: string;
  name: string;
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
  applicationDate: string;
  location: string;
  gender: string;
  age: number;
}

export interface OnSiteIQAtsDB extends DBSchema {
  candidates: {
    key: number;
    value: Candidate;
  };
}
