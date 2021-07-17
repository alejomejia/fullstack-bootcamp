import CountryDetail from "../CountryDetail";
import CountryItem from "../CountryItem";

const Countries = ({ countries, weather }) => {
  if (!countries.length) return "No countries found. Try with another name.";

  if (countries.length > 10) {
    return "Too many matches, please be more specific";
  } else if (countries.length > 1 && countries.length <= 10) {
    return countries.map((country) => (
      <CountryItem key={country.alpha3Code} country={country} />
    ));
  } else if (countries.length === 1) {
    return countries.map((country) => (
      <CountryDetail
        key={country.alpha3Code}
        country={country}
        weather={weather}
      />
    ));
  }
};

export default Countries;
