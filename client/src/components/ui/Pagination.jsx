function Pagination({ pagination = { page: 1, count: 0 }, handlePageChange = () => {} }) {
  const { page, count } = pagination;
  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize);

  const onPreviousPage = () => {
    handlePageChange({
      page: page > 0 ? page - 1 : 1,
      count: count,
    });
  };

  const onNextPage = () => {
    handlePageChange({
      page: page > totalPages ? page : page + 1,
      count: count,
    });
  };

  return (
    <div className="flex space-x-1">
      <button
        className="rounded-md border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-secondary hover:border-secondary focus:text-white focus:bg-secondary focus:border-secondary active:border-secondary active:text-white active:bg-secondary disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        onClick={onPreviousPage}
        disabled={page <= 1}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const pageNumber = i + 1;
        const showPage =
          pageNumber === 1 ||
          pageNumber === count ||
          (pageNumber >= page - 1 && pageNumber <= page + 2);

        if (!showPage) {
          if (pageNumber === page - 2) {
            return (
              <span key={pageNumber} className="min-w-9 rounded-md py-2 px-3 text-center opacty-80">
                ...
              </span>
            );
          }
          return null;
        }

        return (
          <button
            key={pageNumber}
            className={`${
              page === pageNumber ? "bg-secondary text-white shadow-none border-transparent" : ""
            } min-w-9 rounded-md py-2 px-3 border border-slate-300 hover:border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg hover:bg-slate-600 hover:text-white disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2`}
            onClick={() =>
              handlePageChange({
                page: pageNumber,
                count: count,
              })
            }
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        className="min-w-9 rounded-md border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-secondary hover:border-secondary focus:text-white focus:bg-secondary focus:border-secondary active:border-secondary active:text-white active:bg-secondary disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        onClick={onNextPage}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
