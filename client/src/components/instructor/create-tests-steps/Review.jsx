import QuestionCard from "../../QuestionCard";

function Review({ questions = [] }) {
  return (
    <>
      {questions.map((question, questionIndex) => (
        <QuestionCard key={questionIndex} question={question} />
      ))}
    </>
  );
}

export default Review;
