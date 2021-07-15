import { useState } from "react";

const Heading = ({ title }) => {
  return <h2>{title}</h2>;
};

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Statistic = ({ label, value }) => {
  return (
    <tr>
      <td>{label}:</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = good * 1 + neutral * 0 + bad * -1;
  const positive = (good * 100) / total;

  return (
    <table>
      <tbody>
        <Statistic label="Good" value={good} />
        <Statistic label="Neutral" value={neutral} />
        <Statistic label="Bad" value={bad} />
        <Statistic label="Total" value={total} />
        <Statistic label="Average" value={average} />
        <Statistic label="Positive" value={`${positive}%`} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodFeedback = () => setGood(good + 1);
  const handleNeutralFeedback = () => setNeutral(neutral + 1);
  const handleBadFeedback = () => setBad(bad + 1);

  return (
    <div>
      <Heading title="Give feedback" />
      <Button text="Good" handleClick={handleGoodFeedback} />
      <Button text="Neutral" handleClick={handleNeutralFeedback} />
      <Button text="Bad" handleClick={handleBadFeedback} />
      <Heading title="Statistics" />
      {good || neutral || bad ? (
        <Statistics good={good} neutral={neutral} bad={bad} />
      ) : (
        "No feedback given"
      )}
    </div>
  );
};

export default App;
