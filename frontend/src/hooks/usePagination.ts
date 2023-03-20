import { useEffect, useState } from 'react';

const usePagination = (data: any[], itemPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemPerPage);

  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(1);
    } else {
      setCurrentPage(currentPage);
    }
  }, [maxPage, currentPage]);

  const currentData = (() => {
    const begin = (currentPage - 1) * itemPerPage;
    const end = begin + itemPerPage;
    return data.slice(begin, end);
  })();

  const goNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, maxPage));
  };

  const goPrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const jumpTo = (page: number) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  };

  return { goNext, goPrev, jumpTo, currentData, currentPage, maxPage };
};

export default usePagination;
