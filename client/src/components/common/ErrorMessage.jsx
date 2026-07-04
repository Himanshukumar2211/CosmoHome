export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="rounded-3xl border border-[#f2b8c8] bg-[#fff1f4] p-6 text-center text-[#6c2d43]">
      <h3 className="text-lg font-bold">{title}</h3>
      {message ? <p className="mt-2 text-sm">{message}</p> : null}
      {onRetry ? (
        <button className="mt-4 text-sm font-semibold underline underline-offset-4" type="button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
