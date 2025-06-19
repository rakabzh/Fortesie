import axios from "axios";

async function login(url) {
  const params = new URLSearchParams();
  params.append("client_id", "green-euro");
  params.append("client_secret", "lGoY3XIZsnrmnG7iopgAKc5zzvsx2xHI");
  params.append("grant_type", "client_credentials");
  const reponse = await axios.post(url, params);
  return reponse.data.access_token;
}

async function getData(url, token) {
  try {
    const params = {
      tenant: "fortesie_demo_4",
      urn: "ngsi",
      ld: "fortesie",
      building_2640: "wser-temperature",
    };
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });
    return response;
  } catch (error) {
    return error;
  }
}
async function main() {
  console.log(
    await getData(
      "https://analytics.fortesie.epu.ntua.gr/calculate_overall_degree_days/get_sensor_data_by_id/",
      await login(
        "https://fortesie.eurodyn.com/auth/realms/fortesie/protocol/openid-connect/token"
      )
    )
  );
}

main();
