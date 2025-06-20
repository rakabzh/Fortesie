import axios from "axios";
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
  "2460",
];

async function getDegreDayData(url, building) {
  const params = {
    keycloak_token:
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ3QWtNZU9ISDRqbVh5WWhMamkzSUVXYkhya3RFeXVTYmdmaVJLZWxzbGVBIn0.eyJleHAiOjE3NTA0MzY2MzUsImlhdCI6MTc1MDQwNzgzNSwianRpIjoiMDRiZWEzNjYtY2ExMS00ZTAxLTg5MjYtOWM5NWE0ZDUxOWQ2IiwiaXNzIjoiaHR0cHM6Ly9mb3J0ZXNpZS5ldXJvZHluLmNvbS9hdXRoL3JlYWxtcy9mb3J0ZXNpZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI3MzdkYTJjYi1lOTg5LTRlYzgtOGI4Mi0zNmI4Mjc0OWY0OTIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJncmVlbi1ldXJvIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWZvcnRlc2llIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiI3OC4xMjYuMTY0LjIxNiIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1ncmVlbi1ldXJvIiwiY2xpZW50QWRkcmVzcyI6Ijc4LjEyNi4xNjQuMjE2IiwiY2xpZW50X2lkIjoiZ3JlZW4tZXVybyJ9.NreMheHe7zouy6VSJOMJySTTeaIDyzqmNp-Q_hieYCDJmB7pgRM0NumK_sdTqbfetgdTxc006mRr6Ks7IPw0Q3bEs3lw6PoqMUN72GtPXLtrBS0ntKlQ3uuSstz8f8HsEc_4hx31zdOW30zQweTCFQnkidSh41q9MtB2rrnAdO47xQ5Su2xE9Yl_SBj6bH--7Vpu0Ib3mZTwsvMNWUYsR_3zdRoJn4mi5mP2rG480ecQmshs2OMy7GBxLjkedh7d5PcOJrABA9kPORx_tyCmeXCRfipn3rwOmuQqcpJy9u7bhaJs-FjpfhvdESU7NExwHMaHhIFeefy9MzXshAHthg",
    overall_degree_base_temperature: "100",
    sensor: `urn:ngsi-ld:fortesie:demo-4:${building}:wser-temperature`,
    from: "2023-08-21T00:00:00.000Z",
    to: "2024-11-20T00:00:00.000Z",
  };
  const response = await axios.get(url, {
    params: params,
  });
  return response.data;
}

async function getData(url) {
  for (let i = 0; i < buildingList.length; i++) {
    const buildingString = "building_" + buildingList[i];
    const data = await getDegreDayData(url, buildingString);
    const simplifiedData = data.overall_degree_days
      .map((item) => ({
        value: item.value,
        observedAt: item.observedAt,
      }))
      .sort(
        (a, b) =>
          new Date(a.observedAt).getTime() - new Date(b.observedAt).getTime()
      );
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
  console.log(
    await getData(
      "https://analytics.fortesie.epu.ntua.gr/calculate_overall_degree_days/fortesie_demo_4"
    )
  );
}

main();
