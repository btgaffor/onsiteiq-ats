import { Candidate, RandomUser } from "./types";

export async function fetchCandidates(): Promise<Candidate[]> {
  const response = await fetch("https://randomuser.me/api?results=10");
  const json = await response.json();
  return json.results.map(getCandidateFromRandomUser);
}

function getCandidateFromRandomUser(user: RandomUser): Candidate {
  return {
    status: "pending",
    note: "",
    name: [user.name.first, user.name.last].join(" "),
    picture: user.picture,
    applicationDate: user.registered.date,
    location: getLocationFromRandomUser(user.location),
    gender: user.gender,
    age: user.dob.age,
  }
}

function getLocationFromRandomUser(location: RandomUser["location"]): string {
  const { street, city, state, postcode } = location;
  let locationString = "";
  if (street.number && street.name) locationString += `${street.number} ${street.name}`;
  if (city && state) locationString += ` ${city}, ${state}`;
  if (postcode) locationString += ` ${postcode}`;
  return locationString;
}
