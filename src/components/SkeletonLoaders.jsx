// SkeletonLoader.jsx
const shimmer =
  "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 " +
  "dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 " +
  "bg-[length:200%_100%] animate-shimmer";

const SkeletonLoader = ({ type = "card", count = 4 }) => {
  if (type === "card") {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700">
        <div className={`h-4 rounded w-1/2 mb-3 ${shimmer}`}></div>
        <div className={`h-8 rounded w-1/3 ${shimmer}`}></div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700">
        <div className={`h-6 rounded w-1/3 mb-4 ${shimmer}`}></div>
        <div className={`h-48 rounded ${shimmer}`}></div>
      </div>
    );
  }

  if (type === "insight") {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700">
        <div className={`h-6 rounded w-1/4 mb-3 ${shimmer}`}></div>
        <div className="space-y-2">
          <div className={`h-4 rounded w-full ${shimmer}`}></div>
          <div className={`h-4 rounded w-5/6 ${shimmer}`}></div>
          <div className={`h-4 rounded w-4/5 ${shimmer}`}></div>
          <div className={`h-4 rounded w-full ${shimmer}`}></div>
        </div>
      </div>
    );
  }

  if (type === "table-row") {
    return (
      <>
        {[1, 2, 3, 4, 5].map((key) => (
          <tr key={key} className="border-b border-gray-100 dark:border-zinc-700">
            {Array(count).fill(0).map((_, i) => (
              <td key={i} className="px-6 py-4">
                <div className={`h-4 rounded ${shimmer}`}></div>
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  return null;
};

export default SkeletonLoader;
