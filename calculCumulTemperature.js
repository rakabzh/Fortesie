import axios from "axios";
import fs from "fs";

const startGolbalDate = new Date("2/21/23");
const endGlobalDate = new Date("8/20/24");

const buildingList = [
  "2901",
  "286",
  "2855",
  "3458",
  "397",
  "2821",
  "2450",
  "3467",
  "2460",
];

async function getDegreDayData(url, building, startDate, endDate) {
  const params = {
    keycloak_token:
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ3QWtNZU9ISDRqbVh5WWhMamkzSUVXYkhya3RFeXVTYmdmaVJLZWxzbGVBIn0.eyJleHAiOjE3NTA3OTcwNTUsImlhdCI6MTc1MDc2ODI1NSwianRpIjoiOTdhZmJlYjAtM2QzMi00YzliLWFjZTYtNWI5ZTkzY2YyNjMzIiwiaXNzIjoiaHR0cHM6Ly9mb3J0ZXNpZS5ldXJvZHluLmNvbS9hdXRoL3JlYWxtcy9mb3J0ZXNpZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI3MzdkYTJjYi1lOTg5LTRlYzgtOGI4Mi0zNmI4Mjc0OWY0OTIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJncmVlbi1ldXJvIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWZvcnRlc2llIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiI3OC4xMjYuMTY0LjIxNiIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1ncmVlbi1ldXJvIiwiY2xpZW50QWRkcmVzcyI6Ijc4LjEyNi4xNjQuMjE2IiwiY2xpZW50X2lkIjoiZ3JlZW4tZXVybyJ9.PqoZip5G86iZC0ik8uqUuapOGPnt6awN5LWRd2Q86DRtZ-g4FXmB13yzMmhnYGo15sXNIYvGe2IRtqowXPmDYYAJHuwl3iz2Cpganyi5d1GKAkB1BWeJbctVsvzewyVPyVPUptSA2gws_j7az0AWOveHMGoLeFo-BXJby50uWntYWIrMJeq4RSUxA4AzPeKwIw1YUbqAOiZQ0FIpn7WylD-ipgG32qvovoI4JNfmuO1qVhPwsv0s_Psf5hbX57Qglm4OEDmESwBwXyz_-sJ5WOFCqd2vhic-GjhZpdLCmRTP6doX2D9XQWaqM_bcQohEKxOM8EIpGIdTB4wtR9mawQ",
    overall_degree_base_temperature: "100",
    sensor: `urn:ngsi-ld:fortesie:demo-4:${building}:wser-temperature`,
    from: startDate,
    to: endDate,
  };
  const response = await axios.get(url, {
    params: params,
  });
  return response.data;
}
async function getSumDD(data) {
  let sum = 0;
  for (let i = 0; i < data.overall_degree_days.length; i++) {
    sum += 100 - data.overall_degree_days[i].value;
  }
  return sum;
}

async function getData(url) {
  for (let building = 0; building < buildingList.length; building++) {
    const buildingString = "building_" + buildingList[building];
    let currentDate = new Date(startGolbalDate);
    let simplifiedData = [];
    while (currentDate < endGlobalDate) {
      let startDate = new Date(currentDate);
      let endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
      const data = await getDegreDayData(
        url,
        buildingString,
        startDate,
        endDate
      );
      simplifiedData.push({
        value: await getSumDD(data),
        startDate: await startDate,
        endDate: await endDate,
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
  }
}
async function main() {
  await getData(
    "https://analytics.fortesie.epu.ntua.gr/calculate_overall_degree_days/fortesie_demo_4"
  );
}

main();
