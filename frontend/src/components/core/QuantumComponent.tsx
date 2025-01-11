import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface QuantumComponentProps {
  children: React.ReactNode;
  animate?: boolean;
}

const QuantumWrapper = styled(motion.div)`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  transition: all 0.3s ease-in-out;
`;

const QuantumComponent: React.FC<QuantumComponentProps> = ({ 
  children, 
  animate = true 
}) => {
  const animationVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: 'spring'
      }
    }
  };

  return (
    <QuantumWrapper
      initial={animate ? "hidden" : false}
      animate={animate ? "visible" : undefined}
      variants={animationVariants}
    >
      {children}
    </QuantumWrapper>
  );
};

export default QuantumComponent;