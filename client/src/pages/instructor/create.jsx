import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import TestInformation from "../../components/instructor/create-tests-steps/TestInformation";
import Questions from "../../components/instructor/create-tests-steps/Questions";
import Review from "../../components/instructor/create-tests-steps/Review";
import Stepper from "../../components/ui/Stepper";
import Button from "../../components/ui/Button";
import { createTest } from "../../api/tests.api";
import toast from "react-hot-toast";
const steps = ["Test Information", "Questions", "Review"];

function CreatePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [testInfoData, setTestInfoData] = useState({
    title: "",
    description: "",
    category: "1",
    duration: "",
    deadline: "",
  });
  const [questionFormData, setQuestionFormData] = useState({
    question: "",
    option: "",
  });
  const [currentOptions, setCurrentOptions] = useState([]);

  const navigate = useNavigate();

  const handlePrevStep = (currentStep) => {
    if (currentStep === 0) return;

    setCurrentStep(currentStep - 1);
  };

  const handleNextStep = (currentStep) => {
    if (currentStep === steps.length - 1) {
      handleCreateTest();
      return;
    }

    if (currentStep === 0) {
      if (testInfoData.duration < 1) {
        toast.error("Duration must be greater than 0");
        return;
      } else if (Object.values(testInfoData).some((value) => !value)) {
        toast.error("All fields are required");
        return;
      }
    } else if (currentStep === 1) {
      if (questions.length === 0) {
        toast.error("At least one question is required");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handleTestInfoChange = (e) => {
    const { name, value } = e.target;

    setTestInfoData((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    if (!currentOptions.length) {
      toast.error("Fill the form with at least one option to add a question");
      return;
    }

    if (currentOptions.every((option) => !option.is_correct)) {
      toast.error("Mark at least one option as correct");
      return;
    }

    setQuestions((prev) => [...prev, { text: questionFormData.question, options: currentOptions }]);
    setQuestionFormData({ question: "", option: "" });
    setCurrentOptions([]);
  };

  const addOption = () => {
    setCurrentOptions((prev) => [...prev, { text: questionFormData.option }]);
    setQuestionFormData((prev) => ({ ...prev, option: "" }));
  };

  const removeQuestion = (questionIndex) => {
    setQuestions((prev) => prev.filter((_, index) => index !== questionIndex));
  };

  const removeOption = (optionIndex) => {
    setCurrentOptions((prev) => prev.filter((_, index) => index !== optionIndex));
  };

  const markAsCorrect = (e, optionIndex) => {
    setCurrentOptions((prev) => {
      const newOptions = [...prev];
      newOptions[optionIndex].is_correct = e.target.checked;
      return newOptions;
    });
  };

  const handleCreateTest = async () => {
    const payload = {
      name: testInfoData.title,
      description: testInfoData.description,
      category: testInfoData.category,
      duration: testInfoData.duration,
      deadline: testInfoData.deadline,
      questions: questions,
    };

    const res = await createTest(payload);

    if (res.status === 201) {
      toast.success("Test created successfully");
      navigate("/instructor");
    } else {
      toast.error("Error creating test");
    }
  };

  return (
    <div>
      <PageTitle title="Create Test" />

      <div className="max-w-2xl mx-auto my-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <div className="max-w-2xl mx-auto flex items-center justify-between mb-8">
        <div className="w-28 ">
          <Button
            text="Prev"
            onClick={() => handlePrevStep(currentStep)}
            disabled={currentStep === 0}
          />
        </div>
        <div className="w-28">
          <Button
            text={currentStep === steps.length - 1 ? "Save" : "Next"}
            onClick={() => handleNextStep(currentStep)}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {currentStep === 0 && (
          <TestInformation
            testInfoData={testInfoData}
            handleTestInfoChange={handleTestInfoChange}
          />
        )}

        {currentStep === 1 && (
          <Questions
            questions={questions}
            questionFormData={questionFormData}
            currentOptions={currentOptions}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            handleQuestionFormData={setQuestionFormData}
            addOption={addOption}
            removeOption={removeOption}
            markOptionAsCorrect={markAsCorrect}
          />
        )}

        {currentStep === 2 && <Review questions={questions} />}
      </div>
    </div>
  );
}

export default CreatePage;
