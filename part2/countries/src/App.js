import { useState, useEffect } from "react";

// Services
import getAllCountries from "./services/getAllCountries";
import getWeather from "./services/getWeather";

// Components
import Search from "./components/Search";
import Countries from "./components/Countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [capital, setCapital] = useState("");
  const [weather, setWeather] = useState({});

  // Set Countries in state and save them in LocalStorage
  useEffect(() => {
    if (localStorage.getItem("countries")) {
      const countriesList = JSON.parse(localStorage.getItem("countries"));
      setCountries(countriesList);
    } else {
      getAllCountries().then((data) => {
        localStorage.setItem("countries", JSON.stringify(data));
        setCountries(data);
      });
    }
  }, []);

  // Add search logic
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchedCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const countriesToShow = search ? searchedCountries : [];

  // Add capital state logic
  const getCapital = (searchedCountries) => {
    if (searchedCountries.length === 0 || searchedCountries.length > 1) {
      setCapital("");
    } else {
      const capital = searchedCountries[0].capital;
      setCapital(capital);
    }
  };

  useEffect(() => {
    getCapital(searchedCountries);
  }, [searchedCountries]);

  // Get weather using capital city
  useEffect(() => {
    if (!capital) return;

    getWeather(capital).then((weather) => setWeather(weather));
  }, [capital]);

  return (
    <div>
      <h1>Country Information</h1>
      <Search value={search} handleChange={handleSearch} />
      <div>
        <h3>Country list</h3>
        <Countries countries={countriesToShow} weather={weather} />
      </div>
    </div>
  );
};

export default App;
