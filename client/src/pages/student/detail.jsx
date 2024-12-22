import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";
import { getTest } from "../../api/tests.api";
import { getAllAttempts } from "../../api/attempts.api";

function DetailPage() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTest(id);
    }
  }, [id]);

  useEffect(() => {
    if (test?.deadline) {
      setIsClosed(new Date(test?.deadline) < new Date());
    }
  }, [test]);

  const fetchTest = async (testId) => {
    try {
      const res = await getTest(testId);
      const data = res.data;

      if (res.status === 200) {
        setTest(data);
        if (testId) fetchAttempts(testId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttempts = async (testId) => {
    const res = await getAllAttempts(1, testId);
    const data = res.data;
    if (res.status === 200) {
      setAttempts(data.count);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-between mb-8 gap-4">
        <div className="flex flex-wrap gap-8">
          <Link to="/student" className="w-28">
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
              <p className="font-semibold">{test?.questions?.length} questions </p>
            </div>

            <p className="font-semibold mt-4">Insctructor: {test?.created_by?.username}</p>

            <p className="font-semibold mt-4">Your attempts: {attempts}</p>
          </div>
        </div>

        <div className="justify-self-end">
          <Link to={`/student/take-test/${id}`}>
            <Button
              text={isClosed ? "Closed" : "Take Test"}
              buttonStyles="w-full bg-success text-white rounded-lg p-3"
              disabled={isClosed || !test?.questions?.length}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
