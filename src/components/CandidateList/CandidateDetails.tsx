import { formatDistance } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Candidate } from "../../util/types";
import {
  ApproveButton,
  Avatar,
  ButtonRow,
  CandidateDetailsContainer,
  DetailsHeading,
  RejectButton,
} from "./styles";

interface Props {
  candidate: Candidate;
  saveNote: (note: string) => Promise<void>;
  saveStatus: (status: Candidate["status"]) => Promise<void>;
}
function CandidateDetails(props: Props) {
  const { candidate, saveNote } = props;

  const [note, setNote] = useState(candidate.note);

  // if a new candidate is selected, reset to the new incoming note value
  const previousCandidate = useRef(candidate);
  useEffect(() => {
    if (previousCandidate.current !== candidate) {
      previousCandidate.current = candidate;
      setNote(candidate.note);
    }
  }, [candidate]);

  const saveStatus = async (status: Candidate["status"]) => {
    await props.saveStatus(status);
    await saveNote(note);
  };

  return (
    <CandidateDetailsContainer>
      <DetailsHeading>
        <Avatar src={candidate.picture.large} type="large" />
        <h1>{candidate.name}</h1>
      </DetailsHeading>
      <ul>
        <li>Gender: {candidate.gender}</li>
        <li>Age: {candidate.age}</li>
        <li>Location: {candidate.location}</li>
      </ul>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        onBlur={() => saveNote(note)}
      />
      <ButtonRow>
        <ApproveButton
          onClick={() => saveStatus("approved")}
          status={candidate.status}
          type="button"
        >
          Approve
        </ApproveButton>
        <RejectButton
          onClick={() => saveStatus("rejected")}
          status={candidate.status}
          type="button"
        >
          Reject
        </RejectButton>
      </ButtonRow>
    </CandidateDetailsContainer>
  );
}

export default CandidateDetails;
