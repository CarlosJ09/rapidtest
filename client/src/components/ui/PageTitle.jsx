import React from "react";

function PageTitle({ title = "", customStyles = "" }) {
  return (
    <h2 className={customStyles ? customStyles : "text-2xl font-bold text-primary"}>
      {title.toUpperCase()}
    </h2>
  );
}

export default PageTitle;
