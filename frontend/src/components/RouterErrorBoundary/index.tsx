import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import BeatLoader from 'react-spinners/BeatLoader';
import { override } from '../../data/constant';
import ErrorFallback from '../ErrorFallback';

const RouterErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={reset}
          resetKeys={[location.key]}
          onError={(error, info) => {
            console.error('Error in Router:', error, info);
          }}
        >
          <Suspense
            fallback={
              <div className="absolute top-0 left-0 h-full w-full bg-[rgba(232,232,232,0.7)]">
                <BeatLoader
                  size={50}
                  color="rgb(142,211,0)"
                  loading
                  cssOverride={override}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default RouterErrorBoundary;
