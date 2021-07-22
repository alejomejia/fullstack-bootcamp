const Search = ({ search, handleSearch }) => {
  return (
    <div className="search">
      <label htmlFor="search">Search by name</label>
      <input id="search" value={search} onChange={handleSearch} />
    </div>
  )
}

export default Search
