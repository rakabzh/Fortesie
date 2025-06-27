import { randomInt } from "crypto";
import fs from "fs";

const buildingList = [
  "2901",
  "286",
  "2855",
  "3458",
  "397",
  "2821",
  "2450",
  "3467",
];

async function getDegreDayData(building, startDate, endDate) {
  const dataModule = await import(`./buildingData/${building}.js`);
  let list = dataModule[building];
  return list.filter((item) => {
    const date = new Date(item.observedAt);
    return date >= startDate && date <= endDate;
  });
}
async function getSumDD(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += 100 - data[i].value;
  }
  return sum;
}

async function getAbsSumDD(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += Math.abs(data[i].value - 82);
  }
  return sum;
}

async function getData() {
  for (let building = 0; building < buildingList.length; building++) {
    const buildingString = "building_" + buildingList[building];
    let tsFile = await import(`./buildings/${buildingString}.js`);
    let listCumulTemperature = [];
    const startGolbalDate =
      tsFile["FORTESIE_" + buildingString.toUpperCase()][
        "monthlyConsumptions"
      ][0].startDate;
    const endGlobalDate =
      tsFile["FORTESIE_" + buildingString.toUpperCase()]["monthlyConsumptions"][
        tsFile["FORTESIE_" + buildingString.toUpperCase()][
          "monthlyConsumptions"
        ].length - 1
      ].endDate;
    endGlobalDate.setHours(23, 59, 59, 999);
    let currentDate = new Date(startGolbalDate);
    let simplifiedData = [];
    while (currentDate < endGlobalDate) {
      let startDate = new Date(currentDate);
      startDate.setHours(12);
      let endDate = new Date(currentDate);
      endDate.setHours(12);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
      const data = await getDegreDayData(buildingString, startDate, endDate);
      const sum = await getSumDD(data);
      listCumulTemperature.push(sum);
      const absSum = await getAbsSumDD(data);
      const dayCount =
        Math.round(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      simplifiedData.push({
        dayCount: dayCount,
        CumulTemperature: sum,
        "SumDD-18": 18 * dayCount - sum,
        "AbsSumDD-18": absSum,
        startDate: startDate,
        endDate: endDate,
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    if (!fs.existsSync("outpout")) {
      fs.mkdirSync("outpout");
    }
    fs.writeFileSync(
      `outpout/${buildingString}.js`,
      `export const ${buildingString} = ${JSON.stringify(
        simplifiedData,
        null,
        2
      )};`,
      "utf-8"
    );
    console.log("build : " + buildingString);
  }
}
async function main() {
  await getData();
}

main();
