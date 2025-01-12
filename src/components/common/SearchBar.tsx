import React from 'react';
import styled from 'styled-components';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search..."
      />
      <SearchButton onClick={onSearch}>Search</SearchButton>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  flex-grow: 1;
  margin-right: 0.5rem;

  &:focus {
    border-color: #007bff; /* Primary color */
    outline: none;
  }
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff; /* Primary color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3; /* Darker shade */
  }
`;

export default SearchBar;