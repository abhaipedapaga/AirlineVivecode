export default function ErrorState({ message, onRetry }) {
  return (
    <div className="p-4 border rounded-xl bg-red-50">
      <p className="text-red-700">{message || 'Something went wrong.'}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-3 px-3 py-2 rounded-md bg-black text-white hover:opacity-90"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
