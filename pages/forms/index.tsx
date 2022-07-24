import * as React from "react";
import ForumList from "./components/ForumList";
import { Tab, Tabs, Box } from "@mui/material";
interface VoterProps {
  onSubmit: () => void;
}
function Forms(props: VoterProps) {
  const [dao, setDao] = React.useState("Balancer");
  const handleChange = (event, newValue) => {
    setDao(newValue);
  };
  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={dao}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Balancer" value="Balancer" />
          <Tab label="Jet" value="Jet" />
          <Tab label="Optimism" value="Optimism" />
        </Tabs>
      </Box>
      <ForumList key={dao} dao={dao}></ForumList>
    </div>
  );
}
export default Forms;
