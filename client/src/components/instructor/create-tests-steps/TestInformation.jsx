import { useEffect, useState } from "react";
import TextInput from "../../ui/TextInput";
import Dropdown from "../../ui/Dropdown";
import { getAllCategories } from "../../../api/categories.api";

function TestInformation({
  testInfoData = {
    title: "",
    description: "",
    category: "",
    duration: 0,
    deadline: "",
  },
  handleTestInfoChange = () => {},
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await getAllCategories();
    const data = res.data?.results?.map((category) => ({
      value: category.id,
      label: category.name,
    }));
    setCategories(data);
  };

  return (
    <div className="bg-surface w-full flex flex-col shadow-md rounded-xl p-4 gap-4">
      <TextInput
        label="Title"
        placeholder="Enter test title"
        name="title"
        value={testInfoData.title}
        onChange={handleTestInfoChange}
      />
      <TextInput
        label="Description"
        placeholder="Enter test description"
        name="description"
        value={testInfoData.description}
        onChange={handleTestInfoChange}
        maxLength={255}
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-8 gap-y-4">
        <Dropdown
          label={"Category"}
          options={categories}
          name="category"
          value={testInfoData.category}
          onChange={handleTestInfoChange}
        />
        <TextInput
          label="Duration"
          placeholder="Enter test duration (in minutes)"
          type="number"
          name="duration"
          value={testInfoData.duration}
          onChange={handleTestInfoChange}
        />
        <TextInput
          label="Deadline"
          type="date"
          name="deadline"
          value={testInfoData.deadline}
          onChange={handleTestInfoChange}
        />
      </div>
    </div>
  );
}

export default TestInformation;
