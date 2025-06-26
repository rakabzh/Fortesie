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
  list.filter(
    (item) =>
      new Date(item.startDate) >= startDate && new Date(item.endDate) <= endDate
  );
  return list;
}
async function getSumDD(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += 100 - data[i].value;
  }
  return sum;
}

async function getData() {
  for (let building = 0; building < buildingList.length; building++) {
    const buildingString = "building_" + buildingList[building];
    let tsFile = await import(`./buildings/${buildingString}.js`);
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
      simplifiedData.push({
        dayCount:
          Math.round(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1,
        value: await getSumDD(data),
        startDate: startDate,
        endDate: endDate,
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    fs.writeFileSync(
      buildingString + ".js",
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
