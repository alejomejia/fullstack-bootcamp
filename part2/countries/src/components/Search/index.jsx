const Search = ({ value, handleChange }) => {
  return (
    <div>
      <label htmlFor="search">Find country</label>
      <input id="search" value={value} onChange={handleChange} />
    </div>
  );
};

export default Search;
