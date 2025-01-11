import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  footer?: React.ReactNode;
  closeable?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'medium',
  footer,
  closeable = true
}) => {
  const handleClose = () => {
    if (closeable) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContainer
            $size={size}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
                {closeable && (
                  <CloseButton onClick={handleClose}>
                    &times;
                  </CloseButton>
                )}
              </ModalHeader>
            )}
            <ModalContent>{children}</ModalContent>
            {footer && (
              <ModalFooter>
                {footer || (
                  <Button 
                    variant="secondary" 
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                )}
              </ModalFooter>
            )}
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled(motion.div)<{ $size: string }>`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: ${props => {
    switch (props.$size) {
      case 'small': return '350px';
      case 'medium': return '550px';
      case 'large': return '900px';
      default: return '550px';
    }
  }};
  max-width: 95%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const ModalContent = styled.div`
  flex-grow: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
`;

export default Modal;