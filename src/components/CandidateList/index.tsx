import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import { match, variantModule, VariantOf } from "variant";
import { run } from "../../util";
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
  ButtonRow,
  Card,
  CardApplied,
  CardDetails,
  CardMainContent,
  CardName,
  CardStatus,
  Container,
  FilterButton,
  MobileDetails,
  NewCandidatesButton,
  UnorderedList,
} from "./styles";

const State = variantModule({
  loading: () => ({}),
  loaded: (
    candidates: Candidate[],
    filter: "all" | Candidate["status"],
    selectedIndex: number | undefined,
    fetchingMore: boolean
  ) => ({
    candidates,
    filter,
    selectedIndex,
    fetchingMore,
  }),
});
export type State = VariantOf<typeof State>;

interface Props {}
function CandidateList(props: Props) {
  const {} = props;

  const [state, setState] = useState<State>(State.loading());

  useEffect(() => {
    run(async () => {
      const candidates = await loadCandidates();
      setState(State.loaded(candidates, "all", 0, false));
    });
  }, []);

  function selectFilter(newFilter: "all" | Candidate["status"]) {
    if (state.type !== "loaded") return;
    setState({ ...state, filter: newFilter, selectedIndex: undefined });
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
      if (filter == "all") {
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

  return match(state, {
    // Loading data from indexeddb is fast enough that it looks worse to flash a loading state
    loading: () => null,
    loaded: (state) => {
      const { candidates, filter, selectedIndex, fetchingMore } = state;
      const selectedCandidate =
        selectedIndex === undefined ? undefined : candidates[selectedIndex];

      const filteredCandidatesLength =
        filter === "all"
          ? candidates.length
          : candidates.filter((candidate) => candidate.status === filter)
              .length;

      return (
        <Container>
          <div>
            <ButtonRow>
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <FilterButton
                  selected={filter === status.toLowerCase()}
                  onClick={() => selectFilter(status.toLowerCase() as any)}
                  key={status}
                >
                  {status}
                </FilterButton>
              ))}
            </ButtonRow>
            <UnorderedList>
              {filteredCandidatesLength > 0 ? (
                candidates.map((candidate, index) => {
                  if (filter !== "all" && candidate.status !== filter)
                    return null;

                  return (
                    <Card
                      as="li"
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
                        <MobileDetails>
                          <CandidateDetails
                            candidate={candidate}
                            saveNote={saveNote}
                            saveStatus={saveStatus}
                          />
                        </MobileDetails>
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
          </div>
          <div>
            {selectedCandidate ? (
              <CandidateDetails
                candidate={selectedCandidate}
                saveNote={saveNote}
                saveStatus={saveStatus}
              />
            ) : (
              <em>No candidate selected.</em>
            )}
          </div>
        </Container>
      );
    },
  });
}

export default CandidateList;
