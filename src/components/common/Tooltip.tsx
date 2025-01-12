import React, { useState } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <TooltipContainer
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && <TooltipText>{text}</TooltipText>}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.span`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.span`
  visibility: visible;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Position above the element */
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.9;
  white-space: nowrap;

  /* Arrow */
  &::after {
    content: '';
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent; /* Arrow color */
  }
`;

export default Tooltip;