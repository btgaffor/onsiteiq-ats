import styled from "@emotion/styled";
import { Candidate } from "../../util/types";

export const Container = styled.div`
  display: flex;
  margin-inline: auto;
  height: 100%;
  max-width: 1024px;
  padding: 12px;

  section {
    flex-basis: 400px;
    overflow-y: auto;
    margin-right: 16px;
    padding-right: 12px;
  }

  main {
    flex: 1;
  }

  @media (max-width: 800px) {
    height: unset;

    > section {
      margin: 0;
      padding: 0;
      width: 100%;
      flex-basis: unset;
    }
  }

  .desktop-only {
    @media (max-width: 800px) {
      display: none;
    }
  }

  .mobile-only {
    @media (min-width: 801px) {
      display: none;
    }
  }
`;

export const SectionHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 8px;
`;

export const FilterFieldSet = styled.fieldset`
  column-gap: 8px;
  display: flex;
  overflow-x: auto;

  > legend {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  > input {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  label {
    background-color: buttonface;
    border-radius: 8px;
    cursor: pointer;
    flex: 1;
    padding: 8px 12px;
    text-align: center;
  }

  input:checked + label {
    background-color: lightblue;
  }

  input:focus + label {
    outline-style: auto;
    outline-width: 1px;
  }

  > div[aria-live="polite"] {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }
`;

export const UnorderedList = styled.ul`
  margin-top: 8px;
  padding: 0;

  button {
    text-align: left;
    width: 100%;
  }

  > * + * {
    margin-top: 8px;
  }
`;

export const Card = styled.div<{ selected?: boolean }>`
  background-color: white;
  border-radius: 8px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  list-style: none;
  row-gap: 8px;

  @media (min-width: 801px) {
    :hover {
      background-color: lightgray;
    }

    background-color: ${(props) => (props.selected ? "lightblue" : "white")};
    border: 1px solid ${(props) => (props.selected ? "blue" : "black")};
  }
`;

export const CardMainContent = styled.button`
  column-gap: 8px;
  display: flex;
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: unset;
`;

export const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

export const CardName = styled.div`
  font-size: 1.2em;
`;

export const CardApplied = styled.div`
  font-size: 0.8em;
`;

export const CardStatus = styled.div<{ status: Candidate["status"] }>`
  flex-grow: 1;
  align-self: center;
  text-align: right;
  /* this is functioning as an icon, which is why the font-size is in px. In a real app, this would
     probably be an svg and thus sized differently */
  font-size: 40px;
  ${(props) =>
    props.status === "approved"
      ? "color: green;"
      : props.status === "rejected"
      ? "color: red;"
      : "display: none;"}
`;

export const Avatar = styled.img<{ type: keyof Candidate["picture"] }>`
  /* pre-sized to prevent layout shift as image sources load */
  ${(props) =>
    props.type === "thumbnail"
      ? `
    width: 48px;
    height: 48px;
  `
      : `
    width: 128px;
    height: 128px;
  `}
`;

export const NewCandidatesButton = styled.button`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 8px;
`;

export const CandidateDetailsContainer = styled.main`
  padding: 0 12px 8px 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
  row-gap: 12px;

  > ul {
    list-style: disc;
    margin-left: 16px;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;

    textarea {
      flex: 1;
    }

    @media (min-width: 801px) {
      flex: 1;
    }

    @media (max-width: 800px) {
      height: 150px;
    }
  }

  > em {
    display: block;
    width: 100%;
    text-align: center;
  }
`;

export const ButtonRow = styled.div`
  column-gap: 8px;
  display: flex;
  overflow-x: auto;

  > button {
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
  }
`;

export const DetailsHeading = styled.h1`
  column-gap: 36px;
  display: flex;

  > span {
    flex: 1;
    align-self: center;
    font-size: 2rem;
  }

  @media (max-width: 800px) {
    display: none;
  }
`;

export const ApproveButton = styled.button<{ status: Candidate["status"] }>`
  ${(props) =>
    props.status === "approved" &&
    `
    background-color: green;
    color: white;
  `}
`;

export const RejectButton = styled.button<{ status: Candidate["status"] }>`
  ${(props) =>
    props.status === "rejected" &&
    `
    background-color: red;
    color: white;
  `}
`;
