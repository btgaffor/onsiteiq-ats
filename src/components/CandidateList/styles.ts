import styled from "@emotion/styled";
import { Candidate } from "../../util/types";

export const Container = styled.div`
  display: flex;
  margin-inline: auto;
  height: 100%;
  max-width: 1024px;
  padding: 12px;

  > :nth-of-type(1) {
    flex-basis: 400px;
    overflow: scroll;
    margin-right: 16px;
    padding-right: 12px;
  }

  > :nth-of-type(2) {
    flex: 1;
  }

  @media (max-width: 800px) {
    height: unset;

    > :nth-of-type(1) {
      margin: 0;
      padding: 0;
      width: 100%;
      flex-basis: unset;
    }

    > :nth-of-type(2) {
      display: none;
    }
  }
`;

export const FilterButton = styled.button<{ selected?: boolean }>`
  ${(props) => props.selected && "background-color: lightblue;"}
`;

export const UnorderedList = styled.ul`
  margin-top: 8px;
  padding: 0;

  > * + * {
    margin-top: 8px;
  }
`;

export const Card = styled.div<{ selected?: boolean }>`
  background-color: white;
  border-radius: 8px;
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 8px 12px;
  row-gap: 8px;

  :hover {
    background-color: lightgray;
  }

  @media (min-width: 801px) {
    background-color: ${(props) => (props.selected ? "lightblue" : "white")};
    border: 1px solid ${(props) => (props.selected ? "blue" : "black")};
  }
`;

export const CardMainContent = styled.div`
  column-gap: 8px;
  display: flex;
`;

export const MobileDetails = styled.div`
  @media (min-width: 801px) {
    display: none;
  }
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
  font-size: 48px;
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
  width: 100%;
  border-radius: 8px;
`;

export const CandidateDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  row-gap: 12px;

  > ul {
    list-style: disc;
    margin-left: 16px;
  }

  > textarea {
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
  overflow: scroll;

  > button {
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
  }
`;

export const DetailsHeading = styled.div`
  column-gap: 36px;
  display: flex;

  > h1 {
    flex: 1;
    align-self: center;
    font-size: 2em;
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
