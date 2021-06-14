import moment from "moment";
import React, { useState } from "react";
import { useAllAuntDates, createAuntDate } from "../graphql/api";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  text: { margin: theme.spacing(1) },
  table: { marginTop: theme.spacing(1) },
}));

export default function Main() {
  const classes = useStyles();

  const [name, setName] = useState(null);
  const [newDate, setNewDate] = useState(null);

  // 读取所有数据
  const { data } = useAllAuntDates();
  const dates = data?.allAuntDates?.data;

  // 获取该用户的日期数据
  const userDates = dates
    ?.filter((date) => date.name == name)
    .map((date) => date.date)
    .sort()
    .reverse();

  // 计算下次时间
  const calcNextDate = () => {
    const length = userDates?.length;
    if (length > 1) {
      let total = 0;
      for (let i = 1; i < length; i++) {
        const diff = moment(userDates[i]).diff(
          moment(userDates[i - 1]),
          "days"
        );
        total += diff;
      }
      const avgDiff = Math.round(total / (length - 1));
      const nextDate = moment(userDates[length - 1]).add(avgDiff, "days");
      return nextDate.format("YYYY-MM-DD");
    } else {
      return "数据不足，无法计算";
    }
  };

  // 新建数据
  function handleSubmit() {
    createAuntDate(name, newDate).catch((error) => {
      console.log(`boo :( ${error}`);
      alert("添加失败，请联系甲鱼");
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Brightness2Icon />
        </Avatar>
        <Typography variant="h5">生命之海记录仪</Typography>
      </div>
      <form className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="用户名"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Typography variant="body1" className={classes.text}>
          下次降临：{calcNextDate()}
        </Typography>
        <Grid container spacing={1} justify="center" alignItems="center">
          <Grid item xs={10}>
            <TextField
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="新日期"
              autoFocus
              value={newDate}
              onChange={(event) => setNewDate(event.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              添加
            </Button>
          </Grid>
        </Grid>
      </form>
      {userDates?.length == 0 ? (
        <Typography className={classes.text}>{"没有数据"}</Typography>
      ) : (
        <Table className={classes.table}>
          <TableHead>历史数据</TableHead>
          <TableBody>
            {userDates?.map((row) => {
              console.log(row);
              return (
                <TableRow>
                  <TableCell>{row}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
