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
  className: string
}
function CandidateDetails(props: Props) {
  const { candidate, saveNote, className } = props;
  const [note, setNote] = useState(candidate.note);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current && headingRef.current.focus();
  }, [candidate]);

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
    <CandidateDetailsContainer tabIndex={-1} ref={headingRef} className={className} aria-describedby="candidate-heading">
      <DetailsHeading id="candidate-heading">
        <Avatar
          src={candidate.picture.large}
          type="large"
          alt={`profile image of ${candidate.name}`}
        />
        <span>{candidate.name}</span>
      </DetailsHeading>
      <ul>
        <li>Gender: {candidate.gender}</li>
        <li>Age: {candidate.age}</li>
        <li>Location: {candidate.location}</li>
      </ul>
      <label>
        <div>Note:</div>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onBlur={() => saveNote(note)}
        />
      </label>
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
