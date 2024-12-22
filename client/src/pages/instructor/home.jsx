import { useEffect, useState } from "react";
import { getInstructorTests } from "../../api/tests.api";
import { getAllCategories } from "../../api/categories.api";
import PageTitle from "../../components/ui/PageTitle";
import Badge from "../../components/ui/Badge";
import TestCard from "../../components/TestCard";
import Pagination from "../../components/ui/Pagination";
import { color } from "../../utils/category";

function InstructorHomePage() {
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, count: 0 });

  useEffect(() => {
    fetchTestsCategories();
  }, []);

  useEffect(() => {
    fetchTests(selectedCategory?.id);
  }, [selectedCategory]);

  const fetchTests = async (page, category) => {
    const res = await getInstructorTests(page, category);
    const data = res?.data?.results;

    if (res.status === 200) {
      setTests(data);
      setPagination((prev) => ({ ...prev, count: res?.data?.count }));
    }
  };

  const fetchTestsCategories = () => {
    getAllCategories().then((res) => {
      setCategories(res?.data?.results);
    });
  };

  const handleSelectedCategory = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      return;
    }
    setSelectedCategory(category);
  };

  const handlePageChange = (newPagination) => {
    setPagination(newPagination);
  };

  return (
    <>
      <PageTitle title="My Tests" />

      <div className="flex flex-wrap justify-center items-center gap-6 mt-8 md:mt-4">
        {categories.map((category) => (
          <button key={category.id} onClick={() => handleSelectedCategory(category)}>
            <Badge
              text={category.name}
              customStyles={`${
                category === selectedCategory ? `text-white ${color(category.name)}` : "bg-surface "
              } hover:opacity-80`}
            />
          </button>
        ))}
      </div>

      {tests.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-8 mt-12">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              cardStyles={`${color(test.category.name)} text-white`}
              buttonStyles={`${color(test.category.name, true)}`}
            />
          ))}
        </div>
      ) : (
        <p className="text-center font-semibold my-24">No results</p>
      )}

      {!!tests.length && (
        <div className="flex justify-center mt-12">
          <Pagination pagination={pagination} handlePageChange={handlePageChange} />
        </div>
      )}
    </>
  );
}

export default InstructorHomePage;
