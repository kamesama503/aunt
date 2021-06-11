import fs from "fs";
import moment from "moment";
import React, { useState } from "react";

// 读取日期文件
const getDate = async () => {
  return JSON.parse(fs.readFileSync("./public/yueyueData.json", "utf8"));
};

// 计算下次时间
const calcNextDate = async () => {
  const data = await getDate();
  const length = data.length;
  if (length > 1) {
    let total = 0;
    for (let i = 1; i < length; i++) {
      const diff = moment(data[i]).diff(moment(data[i - 1]), "days");
      total += diff;
    }
    const avgDiff = Math.round(total / (length - 1));
    const nextDate = moment(data[length - 1]).add(avgDiff, "days");
    return nextDate.format("YYYY-MM-DD");
  } else {
    return "数据不足，无法计算";
  }
};

export default function Container({ nextDate }) {
  const [value, setValue] = useState(null);

  return (
    <>
      <div>下次降临：{nextDate}</div>
      <div>
        新日期：
        <input
          type="date"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            console.log("value", value);
          }}
        >
          添加
        </button>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const nextDate = await calcNextDate();
  return {
    props: {
      nextDate,
    },
  };
}
