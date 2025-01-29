export const generatePaginationNumbers = (totalPages, currentPage) =>{
  const maxVisiblePages = 3; // Número máximo de páginas visibles
  const halfVisiblePages = Math.floor(maxVisiblePages / 2); // Mitad de las páginas visibles

  let startPage, endPage;

  if (totalPages <= maxVisiblePages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= halfVisiblePages) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + halfVisiblePages >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - halfVisiblePages;
      endPage = currentPage + halfVisiblePages;
    }
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}