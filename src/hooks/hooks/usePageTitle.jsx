import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} - MATAC` : 'MATAC';
  }, [title]);
};

export default usePageTitle;