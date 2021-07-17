import { useState } from "react";

import CountryDetail from "../CountryDetail";

const CountryItem = ({ country }) => {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div>
      <hr />
      <span>{country.name} - </span>
      <button onClick={handleClick}>{show ? "Hide" : "Show"}</button>
      {show && <CountryDetail country={country} hideName />}
      <hr />
    </div>
  );
};

export default CountryItem;
