import React, { useState, useEffect } from "react";
import ForumNode from "./ForumNode";
import { makeStyles } from "@mui/styles";
import { Theme, Grid, List, Divider } from "@mui/material";
import { get_latest_proposal } from "../../../src/forum";
// import "../styles/forum.module.css";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "700px",
    height: "auto",
    boxShadow: "rgba(62, 118, 244, 0.14)",
  },
}));
export interface Post {
  proposal_id: string;
  link: string;
  title: string;
  dao_id: string;
  dao_name: string;
  proposal_state: string;
  proposal_create_date: Date;
  proposal_end_date: Date;
  votes_received: string;
}
export default function ForumList(props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        //temp event
        let postData = [];
        let temp = await get_latest_proposal();
        console.log(temp);
        setPosts(postData);
      } catch {
        setHasError(true);
      }
      setIsLoading(false);
    };
    loadPosts();
  }, [setPosts]);
  return (
    <div>
      {hasError && (
        <p>Error encountered in parsing forum posts, please try again</p>
      )}
      {isLoading ? (
        <p>Loading Events Data. Please wait</p>
      ) : (
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <List>
            {posts.map((post) => (
              <div key={post.proposal_id}>
                <ForumNode data={post}></ForumNode>
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        </Grid>
      )}
    </div>
  );
}
// export default { ForumList };
