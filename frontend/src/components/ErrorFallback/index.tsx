import { TbFaceIdError } from 'react-icons/tb';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <main className="flex items-center justify-center">
      <section className="flex h-2/3 w-1/2 items-center justify-center rounded-md bg-white shadow-md">
        <div className="flex flex-col items-center">
          <TbFaceIdError size={70} color="#1d1d1d" />
          <p className="mt-4 mb-2 text-2xl">Something went wrong</p>
          <p className="break-words text-[#b22222]">{error.message}</p>
          <button
            className="mt-6 rounded-sm bg-wiwynn-blue px-8 py-1 text-white"
            onClick={resetErrorBoundary}
          >
            Try again
          </button>
        </div>
      </section>
    </main>
  );
};

export default ErrorFallback;
