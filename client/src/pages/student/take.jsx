import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";
import QuestionCard from "../../components/QuestionCard";
import { getTest } from "../../api/tests.api";
import { createTestAttempt, updateTestAttempt } from "../../api/attempts.api";
import Loading from "../../components/ui/Loading";
import toast from "react-hot-toast";

function TakeTestPage() {
  const [test, setTest] = useState(null);
  const [counter, setCounter] = useState("");
  const [answers, setAnswers] = useState({});
  const [testAttemptId, setTestAttemptId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAttemptCreated, setIsAttemptCreated] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && !isAttemptCreated) {
      fetchTest(id);
      createAttempt(id);
    }
  }, [id, isAttemptCreated]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (test?.duration) {
      setCounter(test.duration * 60);
      interval = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            handleSubmit(testAttemptId, id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [test]);

  const fetchTest = async (testId) => {
    try {
      setIsLoading(true);
      const res = await getTest(testId);
      setIsLoading(false);
      const data = res.data;

      if (res.status === 200) {
        setTest(data);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const createAttempt = async (testId) => {
    try {
      const res = await createTestAttempt({ test: testId, answers });
      const data = res.data;
      if (res.status === 201 && data.id) {
        setTestAttemptId(data.id);
        setIsAttemptCreated(true);
      } else {
        toast.error("Error creating the test attempt");
        navigate(`/student/test/${id}`);
      }
    } catch (error) {
      console.error("Error submitting the test:", error);
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async (attemptId, testId) => {
    const currentTime = new Date().toISOString();

    try {
      const res = await updateTestAttempt(attemptId, {
        test: testId,
        answers,
        end_time: currentTime,
      });
      if (res.status === 200) {
        toast.success("Test submitted successfully");
        navigate(`/`);
      }
    } catch (error) {
      console.error("Error submitting the test:", error);
    }
  };

  if (isLoading || (!isLoading && !counter)) {
    return <Loading />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-between mb-12 pr-8 gap-4">
        <PageTitle title={`Taking test - ${test?.name}`} />
        <p className={`${counter < 60 && "text-danger"}`}>
          <span className="font-semibold">Time left:</span> {formatTime(counter)}
        </p>
      </div>

      <div>
        {test?.questions?.map((question, questionIndex) => (
          <QuestionCard
            key={questionIndex}
            question={question}
            fillable
            onAnswerChange={handleAnswerChange}
          />
        ))}

        <div className="w-32 ml-auto mt-4">
          <Button
            text="Submit"
            onClick={() => handleSubmit(testAttemptId, id)}
            disabled={!test?.questions?.length}
          />
        </div>
      </div>
    </div>
  );
}

export default TakeTestPage;
