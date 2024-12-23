import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";
import { getTest, deleteTest } from "../../api/tests.api";
import QuestionCard from "../../components/QuestionCard";
import toast from "react-hot-toast";

function DetailPage() {
  const [test, setTest] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTest(id);
    }
  }, [id]);

  const fetchTest = async (testId) => {
    try {
      const res = await getTest(testId);
      const data = res.data;

      if (res.status === 200) {
        setTest(data);
      } else if (data?.detail) {
        toast.error(data.detail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTest = async () => {
    try {
      const res = await deleteTest(id);
      if (res.status === 204) {
        navigate("/instructor");
      } else if (res?.data?.detail) {
        toast.error(res.data.detail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-between mb-8 gap-4">
        <div className="flex flex-wrap gap-8">
          <Link to="/instructor" className="w-28">
            <Button text={"Go Back"} />
          </Link>

          <div>
            <PageTitle title={test?.name} />
            <p className="max-w-2xl">{test?.description}</p>
            <hr className="my-2" />
            <div className="flex flex-wrap gap-2 md:gap-6">
              <p>
                <span className="font-semibold">Duration: </span>
                {test?.duration} minutes
              </p>
              <p>
                <span className="font-semibold">Created: </span>
                {test?.created_at?.slice(0, 10)}
              </p>
              {test?.deadline && (
                <p>
                  <span className="font-semibold">Close: </span>
                  {test.deadline?.slice(0, 10)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="justify-self-end">
          <Button
            text="Delete Test"
            onClick={() => handleDeleteTest(id)}
            buttonStyles="w-full bg-danger text-white rounded-lg p-3"
          />
        </div>
      </div>

      {test?.questions?.length ? (
        <div>
          {test?.questions.map((question, index) => (
            <QuestionCard key={index} question={question} />
          ))}
        </div>
      ) : (
        <p>No questions for this test</p>
      )}
    </div>
  );
}

export default DetailPage;
