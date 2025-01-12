import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <PaginationContainer>
      <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </PageButton>
      {Array.from({ length: totalPages }, (_, index) => (
        <PageButton
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          active={currentPage === index + 1}
        >
          {index + 1}
        </PageButton>
      ))}
      <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </PageButton>
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#007bff' : '#f8f9fa')};
  color: ${({ active }) => (active ? 'white' : '#007bff')};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    background-color: #e9ecef;
    color: #6c757d;
  }

  &:hover:not(:disabled) {
    background-color: #e2e6ea;
  }
`;

export default Pagination;