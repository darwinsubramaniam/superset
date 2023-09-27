import { ReactElement, useCallback, useState } from 'react';
import { ExplainerModal } from './explainerModal';

export const useExplainerModal = (
  initialChartId?: number,
): [() => void, ReactElement | null] => {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = useCallback(() => setIsVisible(true), [isVisible]);
  const closeModal = useCallback(() => setIsVisible(false), [isVisible]);

  return [
    openModal,
    isVisible ? (
      <ExplainerModal
        initialChartId={initialChartId}
        closeModal={closeModal}
        isVisible={isVisible}
      />
    ) : null,
  ];
};
