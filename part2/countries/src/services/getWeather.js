import axios from "axios";

const getWeather = (city) => {
  const TOKEN = process.env.REACT_APP_WEATHER_TOKEN;
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${TOKEN}`;

  return axios.get(URL).then((response) => {
    return response.data;
  });
};

export default getWeather;
