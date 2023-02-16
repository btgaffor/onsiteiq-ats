import { Global } from "@emotion/react";
import "./App.css";
import CandidateList from "./components/CandidateList";
import { globalStyles } from "./components/Styles/reset";

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <CandidateList />
    </>
  );
}

export default App;
