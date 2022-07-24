import * as React from "react";
import ForumList from "./components/ForumList";
interface VoterProps {
  onSubmit: () => void;
}
function Forms(props: VoterProps) {
  return (
    <div>
      <ForumList></ForumList>
    </div>
  );
}
export default Forms;
