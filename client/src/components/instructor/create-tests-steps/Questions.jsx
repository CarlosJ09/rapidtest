import TextInput from "../../ui/TextInput";
import Button from "../../ui/Button";
import QuestionCard from "../../QuestionCard";

function Questions({
  questions = [],
  questionFormData = { question: "", option: "" },
  currentOptions = [],
  handleQuestionFormData = () => {},
  addQuestion = () => {},
  removeQuestion = () => {},
  addOption = () => {},
  removeOption = () => {},
  markOptionAsCorrect = () => {},
}) {
  return (
    <>
      <div className="bg-surface w-full flex flex-col shadow-md rounded-xl p-4 gap-4">
        <TextInput
          label="Question"
          placeholder="Enter question"
          value={questionFormData.question}
          onChange={(e) =>
            handleQuestionFormData({ ...questionFormData, question: e.target.value })
          }
        />
        <TextInput
          label="Option"
          placeholder="Enter option"
          value={questionFormData.option}
          onChange={(e) => handleQuestionFormData({ ...questionFormData, option: e.target.value })}
        />

        <ul>
          {currentOptions.map((option, index) => (
            <li key={index} className="flex items-center gap-x-2 my-2">
              <input
                type="radio"
                name="option"
                value={option.text}
                onChange={(e) => markOptionAsCorrect(e, index)}
              />

              <p className="text-sm">
                <span className="font-bold">{index + 1}. </span>
                {option.text}
              </p>

              <Button
                text="Remove"
                buttonStyles="bg-danger text-white rounded-lg px-2 py-1 text-sm ml-auto"
                onClick={() => removeOption(index)}
              />
            </li>
          ))}
        </ul>

        <div className="md:w-32 mt-4">
          <Button
            text="Add option"
            buttonStyles="w-full bg-info text-white rounded-lg p-3"
            onClick={() => addOption(questionFormData.option)}
          />
        </div>
      </div>

      <div className="my-4">
        <Button text="Add Question" outlined onClick={addQuestion} />
      </div>

      {questions.map((question, questionIndex) => (
        <QuestionCard
          key={questionIndex}
          question={question}
          removeQuestion={() => removeQuestion(questionIndex)}
        />
      ))}
    </>
  );
}

export default Questions;
