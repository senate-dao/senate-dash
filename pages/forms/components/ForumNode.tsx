import React, { useContext } from "react";
import {
  Button,
  Chip,
  Avatar,
  Typography,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { FiberNew, Reply, AlternateEmail, Person } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { purple } from "@mui/material/colors";
import { Post } from "./ForumList";
interface voterNodeProps {
  data: Post;
}
const useStyles = makeStyles((theme) => ({
  listItem: {
    height: "90px",
    backgroundColor: "white",
    paddingTop: "26px",
    paddingBottom: "26px",
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "6px",
    "&:hover": {
      backgroundColor: "blue",
    },
  },
}));
export default function ForumNode(props: voterNodeProps) {
  const classes = useStyles();

  function createAvatar(post: Post) {
    switch (post?.type) {
      case "new":
        return <FiberNew sx={{ color: purple[500] }} />;
      case "reply":
        return <Reply sx={{ color: purple[500] }} />;

      default:
        return <AlternateEmail sx={{ color: purple[500] }} />;
    }
  }
  //function for rendering primary text in our copy
  function primaryText(post: Post) {
    switch (post?.type) {
      case "new":
        return (
          <Typography component="div">
            <Box fontWeight={700} component="span">{`${post.title}`}</Box> added
          </Typography>
        );
      default:
        return "Invalid Post";
    }
  }
  function createVoterIcons(post: Post) {
    if (post?.reply_count < 10) {
      return <Person sx={{ color: purple[500] }} />;
    }
    if (post?.reply_count > 10 && post?.reply_count < 20) {
      return (
        <div>
          <Person sx={{ color: purple[500] }} />{" "}
          <Person sx={{ color: purple[500] }} />
        </div>
      );
    }
    if (post?.reply_count > 20) {
      return (
        <div>
          <Person sx={{ color: purple[500] }} />{" "}
          <Person sx={{ color: purple[500] }} />
          <Person sx={{ color: purple[500] }} />
        </div>
      );
    }
  }
  return (
    <div>
      <ListItem alignItems="center" classes={{ root: classes.listItem }}>
        <ListItemAvatar>
          <Avatar>{createAvatar(props.data)}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={primaryText(props.data)}
          secondary={
            <Typography>
              {" "}
              {props.data?.date_created.toLocaleDateString("pt-PT")}{" "}
            </Typography>
          }
        />
        <div>{createVoterIcons(props.data)}</div>
      </ListItem>
    </div>
  );
}
// export default { ForumNode };
