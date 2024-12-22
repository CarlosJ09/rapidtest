import { useEffect, useState } from "react";
import { getAllSavedTests } from "../../api/saved_tests.api";
import PageTitle from "../../components/ui/PageTitle";
import TestCard from "../../components/TestCard";
import Pagination from "../../components/ui/Pagination";
import Loading from "../../components/ui/Loading";
import { color } from "../../utils/category";

function SavedTestsPage() {
  const [tests, setTests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, count: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSavedTests(pagination.page);
  }, [pagination.page]);

  const fetchSavedTests = async (page) => {
    setIsLoading(true);
    const res = await getAllSavedTests(page);
    const data = res?.data?.results;
    setIsLoading(false);

    if (res.status === 200) {
      setTests(data);
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
    <>
      <PageTitle title="My Saved Tests" />

      {tests.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-8 mt-12">
          {tests.map((test) => (
            <TestCard
              key={test?.test_detail.id}
              test={test?.test_detail}
              cardStyles={`${color(test?.test_detail?.category?.name)} text-white`}
              buttonStyles={`${color(test?.test_detail?.category?.name, true)}`}
              onSave={() => fetchSavedTests(pagination.page)}
              allowSave
            />
          ))}
        </div>
      ) : (
        <p className="text-center font-semibold my-24">You don't have any saved test yet.</p>
      )}

      {!!tests.length && (
        <div className="flex justify-center mt-12">
          <Pagination pagination={pagination} handlePageChange={handlePageChange} />
        </div>
      )}
    </>
  );
}

export default SavedTestsPage;
