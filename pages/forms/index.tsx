import * as React from "react";
import ForumList from "./components/ForumList";
interface VoterProps {
  onSubmit: () => void;
}
function Forms(props: VoterProps) {
  console.log("is this function getting called");
  return (
    <div>
      <ForumList></ForumList>
    </div>
  );
}
export default Forms;
