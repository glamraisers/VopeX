import { useState, useCallback } from 'react';

interface QuantumStateOptions<T> {
  initialValue: T;
  transformer?: (value: T) => T;
}

export function useQuantumState<T>({ 
  initialValue, 
  transformer = (val: T) => val 
}: QuantumStateOptions<T>) {
  const [state, setState] = useState<T>(initialValue);

  const quantumSetState = useCallback((newValue: T | ((prev: T) => T)) => {
    if (typeof newValue === 'function') {
      setState(prev => transformer((newValue as (prev: T) => T)(prev)));
    } else {
      setState(transformer(newValue));
    }
  }, [transformer]);

  return [state, quantumSetState] as const;
}