import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import { fetchCandidates } from "../../util/api";
import {
  loadCandidates,
  saveCandidate,
  saveNewCandidates,
} from "../../util/db";
import { Candidate } from "../../util/types";
import CandidateDetails from "./CandidateDetails";
import {
  Avatar,
  Card,
  CardApplied,
  CardDetails,
  CardMainContent,
  CardName,
  CardStatus,
  Container,
  FilterFieldSet,
  NewCandidatesButton,
  SectionHeading,
  UnorderedList,
} from "./styles";

type State =
  | { type: "loading" }
  | {
      type: "loaded";
      candidates: Candidate[];
      filter: "all" | Candidate["status"];
      selectedIndex: number | undefined;
      fetchingMore: boolean;
    };

function CandidateList() {
  const [state, setState] = useState<State>({ type: "loading" });
  const [ariaLiveAnnouncement, setAriaLiveAnnouncement] = useState("");

  useEffect(() => {
    loadInitialCandidates();
    async function loadInitialCandidates() {
      const candidates = await loadCandidates();
      setState({
        type: "loaded",
        candidates,
        filter: "all",
        selectedIndex: 0,
        fetchingMore: false,
      });
    }
  }, []);

  function selectFilter(newFilter: "all" | Candidate["status"]) {
    if (state.type !== "loaded") return;
    const { candidates } = state;
    const filteredCandidatesLength =
      newFilter === "all"
        ? candidates.length
        : candidates.filter((candidate) => candidate.status === newFilter)
            .length;

    setState({ ...state, filter: newFilter, selectedIndex: undefined });
    setAriaLiveAnnouncement(
      `Filtered to ${filteredCandidatesLength} candidate${
        filteredCandidatesLength === 1 ? "" : "s"
      }.`
    );
  }

  function selectCandidate(index: number | undefined) {
    if (state.type !== "loaded") return;

    setState({
      ...state,
      selectedIndex: state.selectedIndex === index ? undefined : index,
    });
  }

  async function findNewCandidates() {
    if (state.type !== "loaded") return;

    setState({ ...state, fetchingMore: true });

    const data = await fetchCandidates();
    const newCandidates = await saveNewCandidates(data);
    setState({
      ...state,
      fetchingMore: false,
      candidates: [...state.candidates, ...newCandidates],
    });
  }

  async function saveNote(note: string) {
    setState((previousState: State) => {
      if (previousState.type !== "loaded") return previousState;
      const { candidates, selectedIndex } = previousState;
      if (selectedIndex === undefined) return previousState;

      const selectedCandidate = candidates[selectedIndex];
      const updatedCandidate = { ...selectedCandidate, note };

      saveCandidate(updatedCandidate);
      return {
        ...previousState,
        candidates: previousState.candidates.map((candidate) =>
          candidate.id === updatedCandidate.id ? updatedCandidate : candidate
        ),
      };
    });
  }

  async function saveStatus(status: Candidate["status"]) {
    setState((previousState) => {
      if (previousState.type !== "loaded") return previousState;
      const { candidates, filter, selectedIndex } = previousState;
      if (selectedIndex === undefined) return previousState;

      const selectedCandidate = candidates[selectedIndex];
      const updatedCandidate = {
        ...selectedCandidate,
        status: status === selectedCandidate.status ? "pending" : status,
      };

      saveCandidate(updatedCandidate);

      // try to find the next closest or previous closest candidate that has the status of the current filter
      let cursor: number | undefined = selectedIndex + 1;
      if (filter === "all") {
        cursor = selectedIndex;
      } else {
        while (
          cursor < candidates.length &&
          candidates[cursor].status !== filter
        ) {
          cursor++;
        }
        if (cursor === candidates.length) {
          cursor = selectedIndex - 1;
          while (cursor >= 0 && candidates[cursor].status !== filter) {
            cursor--;
          }
        }
        if (cursor === -1) cursor = undefined;
      }

      return {
        ...previousState,
        candidates: previousState.candidates.map((candidate) =>
          candidate.id === updatedCandidate.id ? updatedCandidate : candidate
        ),
        selectedIndex: cursor,
      };
    });
  }

  if (state.type === "loading") {
    return null;
  }

  if (state.type === "loaded") {
    const { candidates, filter, selectedIndex, fetchingMore } = state;
    const selectedCandidate =
      selectedIndex === undefined ? undefined : candidates[selectedIndex];

    const filteredCandidatesLength =
      filter === "all"
        ? candidates.length
        : candidates.filter((candidate) => candidate.status === filter).length;

    return (
      <Container>
        <section>
          <SectionHeading>Candidate List</SectionHeading>
          <FilterFieldSet className="radio-switch">
            <legend>Status Filter</legend>
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <>
                <input
                  type="radio"
                  name="filter"
                  id={status}
                  value={status}
                  checked={filter === status.toLowerCase()}
                  onChange={() => selectFilter(status.toLowerCase() as any)}
                />
                <label htmlFor={status}>{status}</label>
              </>
            ))}
            <div aria-live="polite">{ariaLiveAnnouncement}</div>
          </FilterFieldSet>

          <UnorderedList>
            {filteredCandidatesLength > 0 ? (
              candidates.map((candidate, index) => {
                if (filter !== "all" && candidate.status !== filter)
                  return null;

                return (
                  <Card
                    as="li"
                    role="list-item"
                    key={candidate.id!}
                    selected={index === selectedIndex}
                    onClick={(event: any) => {
                      // don't handle clicks that bubbled up from child elements
                      if (
                        event.target.type !== "textarea" &&
                        event.target.type !== "button"
                      ) {
                        selectCandidate(index);
                      }
                    }}
                  >
                    <CardMainContent>
                      <Avatar
                        src={candidate.picture.thumbnail}
                        type="thumbnail"
                        alt={`profile image of ${candidate.name}`}
                      />
                      <CardDetails>
                        <CardName>{candidate.name}</CardName>
                        <CardApplied>
                          Applied{" "}
                          {formatDistance(
                            new Date(candidate.applicationDate),
                            new Date(),
                            { addSuffix: true }
                          )}
                        </CardApplied>
                      </CardDetails>
                      <CardStatus status={candidate.status}>
                        {candidate.status === "approved" && "✓"}
                        {candidate.status === "rejected" && "✗"}
                      </CardStatus>
                    </CardMainContent>
                    {index === selectedIndex && (
                      <CandidateDetails
                        className="mobile-only"
                        candidate={candidate}
                        saveNote={saveNote}
                        saveStatus={saveStatus}
                      />
                    )}
                  </Card>
                );
              })
            ) : (
              <li>
                <em>
                  No visible candidates. Please select another filter or click
                  the "Find New Candidates" button
                </em>
              </li>
            )}
          </UnorderedList>
          {(filter === "all" || filter === "pending") && (
            <NewCandidatesButton
              disabled={fetchingMore}
              onClick={findNewCandidates}
            >
              Find New Candidates
            </NewCandidatesButton>
          )}
        </section>
        {selectedCandidate ? (
          <CandidateDetails
            candidate={selectedCandidate}
            saveNote={saveNote}
            saveStatus={saveStatus}
            className="desktop-only"
          />
        ) : (
          <em className="desktop-only">No candidate selected.</em>
        )}
      </Container>
    );
  }

  // If all the state cases have been handled, then the type of `state` has been narrowed to `never`
  // by this point. Typescript will error here if that's not the case.
  return ((_state: never) => null)(state);
}

export default CandidateList;
