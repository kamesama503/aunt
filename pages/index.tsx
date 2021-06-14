import moment from "moment";
import React, { useState } from "react";
import { useAllAuntDates } from "../graphql/api";

export default function Container() {
  const [name, setName] = useState(null);
  const [newDate, setNewDate] = useState(null);

  // 读取所有数据
  const { data } = useAllAuntDates();
  const dates = data?.allAuntDates?.data;

  // 获取该用户的日期数据
  const userDates = dates
    ?.filter((date) => date.name == name)
    .map((date) => date.date);
  console.log("userDates", userDates);

  // 计算下次时间
  const calcNextDate = () => {
    const length = userDates.length;
    if (length > 1) {
      let total = 0;
      for (let i = 1; i < length; i++) {
        console.log("userDates[i]", userDates[i]);
        const diff = moment(userDates[i]).diff(
          moment(userDates[i - 1]),
          "days"
        );
        total += diff;
      }
      const avgDiff = Math.round(total / (length - 1));
      const nextDate = moment(userDates[length - 1]).add(avgDiff, "days");
      console.log(nextDate.format("YYYY-MM-DD"));
      return nextDate.format("YYYY-MM-DD");
    } else {
      return "数据不足，无法计算";
    }
  };

  return (
    <>
      <div>
        用户名：
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div>下次降临：{calcNextDate()}</div>
      <div>
        新日期：
        <input
          type="date"
          value={newDate}
          onChange={(event) => setNewDate(event.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            console.log("value", newDate);
          }}
        >
          添加
        </button>
      </div>
      <div>历史数据：{userDates}</div>
    </>
  );
}
