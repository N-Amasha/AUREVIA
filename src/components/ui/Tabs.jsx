export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
}) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto border-b border-stone-200">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onChange(tab.value)}
                className={`
                  relative px-5 py-3 text-sm font-medium transition
                  ${
                    isActive
                      ? "text-primary-800"
                      : "text-stone-500 hover:text-stone-800"
                  }
                `}
              >
                {tab.label}

                {tab.count !== undefined && (
                  <span
                    className={`
                      ml-2 rounded-full px-2 py-0.5 text-xs
                      ${
                        isActive
                          ? "bg-primary-100 text-primary-800"
                          : "bg-stone-100 text-stone-600"
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary-700" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}