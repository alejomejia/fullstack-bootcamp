const Form = ({
  handleSubmit,
  newName,
  newNumber,
  handleNewName,
  handleNewNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" value={newName} onChange={handleNewName} />
      <label htmlFor="number">Number</label>
      <input
        id="number"
        type="number"
        value={newNumber}
        onChange={handleNewNumber}
      />
      <button className="add">Add New Person</button>
    </form>
  );
};

export default Form;
