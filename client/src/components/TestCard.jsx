import { Link, useLocation } from "react-router-dom";
import { createSavedTest, deleteSavedTest } from "../api/saved_tests.api";
import Badge from "./ui/Badge";
import toast from "react-hot-toast";

function TestCard({ test, cardStyles, buttonStyles, allowSave = false, onSave = () => {} }) {
  const { pathname } = useLocation();

  const basePath = pathname.startsWith("/student") ? "/student" : "/instructor";

  const saveTest = async (testId) => {
    try {
      const res = await createSavedTest({ test: testId });

      if (res.status === 201) {
        toast.success(`${res?.data?.test_detail?.name} saved successfully`);
      } else if (res.status === 200) {
        const deleteRes = await deleteSavedTest(res?.data?.id);
        if (deleteRes.status === 204) {
          toast(`${res?.data?.name} unsaved`, {
            icon: "ℹ️",
          });
        }
      }
    } catch (error) {
      console.error("Error saving test:", error);
    } finally {
      onSave();
    }
  };

  return (
    <div className="w-80 h-80 flex flex-col bg-surface border border-slate-200 rounded-xl p-2">
      <div className={`flex flex-col justify-between flex-grow rounded-xl p-4 ${cardStyles}`}>
        <div>
          <div className="flex justify-between items-center">
            <h5 className="text-xl font-bold">{test?.name}</h5>
            {allowSave && (
              <button
                className="bg-white w-8 h-8 rounded-full hover:opacity-80"
                onClick={() => saveTest(test?.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="rgb(55 65 81)"
                  className="size-5 m-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm mt-6">{test?.description}</p>
        </div>

        <div className="flex justify-between items-center font-semibold">
          <Badge text={test?.category?.name} customStyles="border-white" />

          <div className="flex items-center text-sm gap-x-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {test?.duration}m
          </div>
        </div>
      </div>

      <div className="h-16 flex justify-between items-center mt-2 px-1">
        <div>
          <p className="text-sm font-semibold text-secondary">
            Created: {test?.created_at.slice(0, 10)}
          </p>
          {test?.deadline ? (
            <p className={`text-sm font-semibold text-secondary`}>
              Close:
              <span
                className={new Date(test?.deadline) > new Date() ? "text-secondary" : "text-danger"}
              >
                {" " + test?.deadline?.slice(0, 10)}
              </span>
            </p>
          ) : (
            <p className="text-sm text-secondary">No deadline</p>
          )}
        </div>

        <Link to={`${basePath}/test/${test.id}`}>
          <button
            className={`bg-secondary text-white font-bold py-2 px-6 rounded-3xl ${buttonStyles}`}
          >
            Detail
          </button>
        </Link>
      </div>
    </div>
  );
}

export default TestCard;
