const theme: any = () => ({
  card: {
    marginBottom: theme.spacing(2),
    minWidth: 300,
    maxWidth: 600,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  media: {
    height: 150,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  chip: {
    color: "white",
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    color: "white",
  },
});
export default { theme };
