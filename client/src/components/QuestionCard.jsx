import Button from "./ui/Button";

function QuestionCard({ question, fillable = false, onAnswerChange = () => {}, removeQuestion }) {
  return (
    <div className="bg-surface w-full flex flex-col shadow-md rounded-xl p-4 gap-4 mt-4">
      <p className="font-semibold">{question?.text}</p>

      <ul className="w-full flex flex-col gap-4">
        {question?.options?.map((option, optionIndex) => (
          <li key={optionIndex}>
            <div className="flex items-center gap-2">
              {fillable && (
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  onChange={() => onAnswerChange(question.id, option.id)}
                />
              )}
              <p>
                <span className="font-bold">{optionIndex + 1}. </span>
                {option.text}
                {option.is_correct && !fillable ? (
                  <span className="text-success font-bold"> - Correct Answer</span>
                ) : null}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {removeQuestion && (
        <Button
          text="Remove"
          buttonStyles="bg-danger text-white rounded-lg p-2 ml-auto"
          onClick={removeQuestion}
        />
      )}
    </div>
  );
}

export default QuestionCard;
