const CountryDetail = ({ country, weather, hideName }) => {
  const name = country.name;
  const flag = country.flag;
  const capital = country.capital;
  const population = country.population;
  const langs = country.languages;

  return (
    <div>
      <h4>{hideName ? "" : name}</h4>
      <img src={flag} alt={`${name} flag`} width="100" />
      <p>
        <em>Capital:</em> {capital}
      </p>
      <p>
        <em>Population:</em> {population}
      </p>
      <h4>Languages</h4>
      <ul>
        {langs.map((lang) => (
          <li key={lang.iso639_2}>{lang.name}</li>
        ))}
      </ul>
      {weather ? (
        <div>
          <h4>Weather in {capital}</h4>
          <p>
            <em>Temperature:</em> {weather.main.temp} °C
          </p>
          <p>
            <em>Humidiy:</em> {weather.main.humidity}
          </p>
          <p>
            <em>Pressure:</em> {weather.main.pressure}
          </p>
          <p>
            <em>Wind speed:</em> {weather.wind.speed}
          </p>
        </div>
      ) : (
        "Loading weather..."
      )}
    </div>
  );
};

export default CountryDetail;
