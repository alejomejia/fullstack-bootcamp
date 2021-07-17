import axios from "axios";

const getAllCountries = () => {
  const URL = "https://restcountries.eu/rest/v2/all";
  return axios.get(URL).then((response) => {
    return response.data;
  });
};

export default getAllCountries;
