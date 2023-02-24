import { render, screen, act, fireEvent, waitForElementToBeRemoved, waitFor } from "@testing-library/react";
import App from "./App";
import * as db from "./util/db";
import * as API from "./util/api";
import { Candidate } from "./util/types";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  async function mount(initialCandidates: Candidate[]) {
    jest.spyOn(db, "loadCandidates").mockResolvedValue(initialCandidates);
    const saveCandidate = jest.spyOn(db, "saveCandidate").mockResolvedValue();;
    const saveNewCandidates = jest.spyOn(db, "saveNewCandidates");
    const fetchCandidates = jest.spyOn(API, "fetchCandidates");

    render(<App />);
    await screen.findByText('All');

    return {
      saveCandidate,
      saveNewCandidates,
      fetchCandidates,
    };
  }

  it("renders with no candidates", async () => {
    await mount([]);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();

    expect(screen.getByText("Find New Candidates")).toBeInTheDocument();
    expect(screen.getByText(/No visible candidates./)).toBeInTheDocument();
    expect(screen.getByText("No candidate selected.")).toBeInTheDocument();
  });

  it("allows filtering candidates", async () => {
    const candidates: Candidate[] = [
      {
        status: "pending",
        note: "",
        name: "Abigail Carter",
        picture: {
          large: "https://randomuser.me/api/portraits/women/55.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/55.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/55.jpg",
        },
        applicationDate: "2022-03-02T23:29:20.591Z",
        location: "4339 Miller Ave San Francisco, South Dakota 97739",
        gender: "female",
        age: 22,
        id: 131,
      },
      {
        status: "approved",
        note: "",
        name: "Bárbara Fogaça",
        picture: {
          large: "https://randomuser.me/api/portraits/women/34.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/34.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/34.jpg",
        },
        applicationDate: "2007-04-01T21:40:21.370Z",
        location: "4380 Rua João Xxiii Belford Roxo, Rio Grande do Norte 79041",
        gender: "female",
        age: 35,
        id: 132,
      },
      {
        status: "rejected",
        note: "",
        name: "Kaya Van Kesteren",
        picture: {
          large: "https://randomuser.me/api/portraits/women/35.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/35.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/35.jpg",
        },
        applicationDate: "2019-07-08T12:18:11.513Z",
        location: "9331 Jellen Overbetuwe, Flevoland 9171 PJ",
        gender: "female",
        age: 74,
        id: 133,
      },
    ];

    await mount(candidates);

    expect(screen.getAllByText("Abigail Carter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bárbara Fogaça").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kaya Van Kesteren").length).toBeGreaterThan(0);

    userEvent.click(screen.getByText("Pending"))

    expect(screen.getAllByText("Abigail Carter").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Bárbara Fogaça").length).toEqual(0);
    expect(screen.queryAllByText("Kaya Van Kesteren").length).toEqual(0);

    userEvent.click(screen.getByText("Approved"))

    expect(screen.queryAllByText("Abigail Carter").length).toEqual(0);
    expect(screen.getAllByText("Bárbara Fogaça").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Kaya Van Kesteren").length).toEqual(0);

    userEvent.click(screen.getByText("Rejected"))

    expect(screen.queryAllByText("Abigail Carter").length).toEqual(0);
    expect(screen.queryAllByText("Bárbara Fogaça").length).toEqual(0);
    expect(screen.getAllByText("Kaya Van Kesteren").length).toBeGreaterThan(0);
  });

  it("allows updating notes", async () => {
    const candidates: Candidate[] = [
      {
        status: "pending",
        note: "",
        name: "Abigail Carter",
        picture: {
          large: "https://randomuser.me/api/portraits/women/55.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/55.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/55.jpg",
        },
        applicationDate: "2022-03-02T23:29:20.591Z",
        location: "4339 Miller Ave San Francisco, South Dakota 97739",
        gender: "female",
        age: 22,
        id: 131,
      },
      {
        status: "pending",
        note: "",
        name: "Bárbara Fogaça",
        picture: {
          large: "https://randomuser.me/api/portraits/women/34.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/34.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/34.jpg",
        },
        applicationDate: "2007-04-01T21:40:21.370Z",
        location: "4380 Rua João Xxiii Belford Roxo, Rio Grande do Norte 79041",
        gender: "female",
        age: 35,
        id: 132,
      },
    ];

    const { saveCandidate } = await mount(candidates);

    userEvent.type(screen.getAllByRole("textbox")[0], 'changed note');
    userEvent.click(document.body); // trigger blur
    expect(screen.getAllByText("changed note").length).toBeGreaterThan(0);
    expect(
      saveCandidate.mock.calls[saveCandidate.mock.calls.length - 1][0].note
    ).toEqual("changed note");

    // make sure that selecting a different candidate clears the note
    userEvent.click(screen.getByText("Bárbara Fogaça"))
    expect(screen.queryAllByText("changed note").length).toEqual(0);

    // make sure that selecting the original candidate shows their persisted note
    userEvent.click(screen.getByText("Abigail Carter"))
    expect(screen.getAllByText("changed note").length).toBeGreaterThan(0);
  });

  it("allows setting and undoing statuses", async () => {
    const candidates: Candidate[] = [
      {
        status: "pending",
        note: "",
        name: "Abigail Carter",
        picture: {
          large: "https://randomuser.me/api/portraits/women/55.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/55.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/55.jpg",
        },
        applicationDate: "2022-03-02T23:29:20.591Z",
        location: "4339 Miller Ave San Francisco, South Dakota 97739",
        gender: "female",
        age: 22,
        id: 131,
      },
    ];

    const { saveCandidate } = await mount(candidates);

    expect(screen.queryAllByText("✓").length).toEqual(0);
    expect(screen.queryAllByText("✗").length).toEqual(0);

    userEvent.click(screen.getAllByText("Approve")[0])
    expect((await screen.findAllByText("✓")).length).toBeGreaterThan(0);
    expect(screen.queryAllByText("✗").length).toEqual(0);
    expect(
      saveCandidate.mock.calls[saveCandidate.mock.calls.length - 1][0].status
    ).toEqual("approved");

    userEvent.click(screen.getAllByText("Reject")[0])
    expect((await screen.findAllByText("✗")).length).toBeGreaterThan(0);
    expect(screen.queryAllByText("✓").length).toEqual(0);
    expect(
      saveCandidate.mock.calls[saveCandidate.mock.calls.length - 1][0].status
    ).toEqual("rejected");

    // clicking the button again will reset the status
    userEvent.click(screen.getAllByText("Reject")[0])
    await waitFor(() => {
      expect(screen.queryAllByText("✓").length).toEqual(0);
      expect(screen.queryAllByText("✗").length).toEqual(0);
    })
    expect(
      saveCandidate.mock.calls[saveCandidate.mock.calls.length - 1][0].status
    ).toEqual("pending");
  });

  it("auto-advances candidates when approving or rejecting while pending", async () => {
    const candidates: Candidate[] = [
      {
        status: "pending",
        note: "",
        name: "Abigail Carter",
        picture: {
          large: "https://randomuser.me/api/portraits/women/55.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/55.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/55.jpg",
        },
        applicationDate: "2022-03-02T23:29:20.591Z",
        location: "4339 Miller Ave San Francisco, South Dakota 97739",
        gender: "female",
        age: 22,
        id: 131,
      },
      {
        status: "pending",
        note: "",
        name: "Bárbara Fogaça",
        picture: {
          large: "https://randomuser.me/api/portraits/women/34.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/34.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/34.jpg",
        },
        applicationDate: "2007-04-01T21:40:21.370Z",
        location: "4380 Rua João Xxiii Belford Roxo, Rio Grande do Norte 79041",
        gender: "female",
        age: 35,
        id: 132,
      },
    ];

    await mount(candidates);

    userEvent.click(screen.getByText("Pending"))
    userEvent.click(screen.getByText("Abigail Carter"))

    expect(screen.getAllByText("Abigail Carter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bárbara Fogaça").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);

    userEvent.click(screen.getAllByText("Approve")[0])
    expect(screen.queryAllByText("Abigail Carter").length).toEqual(0);
    expect(screen.getAllByText("Bárbara Fogaça").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);

    userEvent.click(screen.getAllByText("Approve")[0])
    // once all candidates are approved, they're gone and none is selected
    expect((await screen.findByText("No candidate selected."))).toBeInTheDocument();
    expect(screen.queryAllByText("Abigail Carter").length).toEqual(0);
    expect(screen.queryAllByText("Bárbara Fogaça").length).toEqual(0);
    expect(screen.queryAllByRole("textbox").length).toEqual(0);
  });

  it('allows "recruiting" more candidates', async () => {
    const { saveNewCandidates } = await mount([]);

    saveNewCandidates.mockResolvedValue([
      {
        status: "pending",
        note: "",
        name: "Abigail Carter",
        picture: {
          large: "https://randomuser.me/api/portraits/women/55.jpg",
          medium: "https://randomuser.me/api/portraits/med/women/55.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/women/55.jpg",
        },
        applicationDate: "2022-03-02T23:29:20.591Z",
        location: "4339 Miller Ave San Francisco, South Dakota 97739",
        gender: "female",
        age: 22,
        id: 131,
      },
    ]);

    expect(screen.queryAllByText("Abigail Carter").length).toEqual(0);

    userEvent.click(screen.getByText("Find New Candidates"))
    expect((await screen.findAllByText("Abigail Carter")).length).toBeGreaterThan(0);
  });
});
