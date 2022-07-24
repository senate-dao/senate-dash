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
  dao: string;
  title: string;
  date_created: Date;
  link: string;
  reply_count: number;
  type: string;
}
function openPost(post: Post) {
  console.log(post.link);
  window.open(encodeURI(post.link), "_blank", "noopener,noreferrer");
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
        console.log("we are here in useeffect");
        console.log(postData);
        let temp = await fetch(
          "https://senatelabsbackend.herokuapp.com/forums"
        );
        console.log(temp);
        let tempJson = await temp.json();
        console.log(tempJson);
        console.log(Object.keys(tempJson[0]));
        tempJson = tempJson.map((post: Post) => {
          return {
            ...post,
            type: "new",
            date_created: new Date(post?.date_created),
          };
        });
        tempJson = tempJson.filter((post: Post) => {
          return Object.values(post).every((x) => x !== null && x !== "");
        });
        setPosts(tempJson);
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
              <div
                key={`${post?.date_created.toLocaleTimeString()} - ${
                  post.title
                } - ${post.dao} - ${Math.random()}`}
                onClick={() => openPost(post)}
              >
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
