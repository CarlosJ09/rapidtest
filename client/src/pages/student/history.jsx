import { useEffect, useState } from "react";
import PageTitle from "../../components/ui/PageTitle";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/ui/Pagination";
import { getAllAttempts } from "../../api/attempts.api";

function HistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, count: 0 });

  useEffect(() => {
    if (pagination.page) {
      fetchHistory(pagination.page);
    }
  }, [pagination.page]);

  const fetchHistory = async (page) => {
    setIsLoading(true);
    const res = await getAllAttempts(page);
    const data = res.data.results;
    setIsLoading(false);

    if (res.status === 200) {
      setAttempts(data);
      setPagination((prev) => ({ ...prev, count: res?.data?.count }));
    }
  };

  const handlePageChange = (newPagination) => {
    setPagination(newPagination);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <PageTitle title="History" />

      <div className="max-w-80 mx-auto mt-12">
        {attempts?.map((attempt) => (
          <div
            key={attempt.id}
            className="h-32 flex flex-col justify-center items-center bg-surface border border-secondary shadow-lg rounded-md my-8 p-4"
          >
            <p className="font-semibold">Test Id: {attempt?.id}</p>

            <p className="font-semibold">{attempt?.test_name}</p>

            <p>{!!attempt?.duration ? `${attempt?.duration} minutes` : "Less than 1 minute"}</p>

            <p>Score: {attempt?.score?.toFixed(2)}</p>

            <p>{attempt?.created_at?.slice(0, 10)}</p>
          </div>
        ))}
      </div>

      {!!attempts.length && (
        <div className="flex justify-center mt-12">
          <Pagination pagination={pagination} handlePageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
