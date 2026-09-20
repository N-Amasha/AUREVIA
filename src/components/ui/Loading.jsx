import { LoaderCircle } from "lucide-react";

export default function Loading({
  message = "Loading...",
  fullPage = false,
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        ${fullPage ? "min-h-screen" : "py-12"}
      `}
    >
      <LoaderCircle className="h-8 w-8 animate-spin text-primary-700" />

      <p className="mt-3 text-sm font-medium text-stone-600">
        {message}
      </p>
    </div>
  );
}