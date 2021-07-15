import { useState } from "react";

const Button = ({ handleClick, label }) => {
  return <button onClick={handleClick}>{label}</button>;
};

const Heading = ({ title }) => {
  return <h2>{title}</h2>;
};

const Anecdote = ({ anecdote }) => {
  return (
    <div className="anecdote">
      <span>-- {anecdote}</span>
    </div>
  );
};

const Votes = ({ votes }) => {
  return (
    <div className="votes">
      <span>This anecdote has {votes} votes</span>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blod tests when dianosing patients",
  ];

  const initialVotes = new Array(anecdotes.length + 1)
    .join("0")
    .split("")
    .map(parseFloat);

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(initialVotes);

  const handleNextAnecdote = () => {
    // Set random number
    const min = 0;
    const max = anecdotes.length - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    setSelected(randomNumber);
  };

  const handleVote = () => {
    let votesCopy = [...votes];
    votesCopy[selected] += 1;

    setVotes(votesCopy);
  };

  const maxVotes = Math.max(...votes);
  const voteWithMaxVotes = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <Button handleClick={handleNextAnecdote} label="Next Anecdote" />
      <Button handleClick={handleVote} label="Vote" />
      <hr />
      <Heading title="Anecdote of the day" />
      <Anecdote anecdote={anecdotes[selected]} />
      <Votes votes={votes[selected]} />
      <hr />
      <Heading title="Anecdote with most votes" />
      {maxVotes === 0 ? (
        "There are no votes yet"
      ) : (
        <>
          <Anecdote anecdote={anecdotes[voteWithMaxVotes]} />
          <Votes votes={votes[voteWithMaxVotes]} />
        </>
      )}
    </div>
  );
};

export default App;
