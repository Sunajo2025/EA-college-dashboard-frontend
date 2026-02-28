import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sparkles, CalendarCheck } from 'lucide-react';

const MeetingSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    setSearching(true);
    
    // Simulate search
    setTimeout(() => {
      setResults([
        {
          meetingId: 1,
          title: "Q1 Product Strategy",
          date: "Jan 22, 2026",
          excerpt: "Discussed payment integration timeline and prioritization...",
          relevance: 95
        },
        {
          meetingId: 2,
          title: "Design System Review",
          date: "Jan 21, 2026",
          excerpt: "Reviewed component library and discussed payment flow designs...",
          relevance: 87
        }
      ]);
      setSearching(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/meetings')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Search Knowledge
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ask questions across all your meetings in natural language
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-gray-100 dark:border-zinc-700">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., What decisions were made about payment integration?"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query || searching}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {searching ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>

        {/* Suggested Questions */}
        {!results.length && !searching && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "What were the key decisions about payment integration?",
                "Which action items are pending from last week?",
                "What did we discuss about the design system?",
                "Show me all meetings with Sarah Chen"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-gray-100 dark:border-zinc-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Results ({results.length})
          </h2>
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.meetingId}
                onClick={() => navigate(`/dashboard/meetings/${result.meetingId}`)}
                className="p-4 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {result.title}
                    </h3>
                  </div>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded-full">
                    {result.relevance}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {result.excerpt}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {result.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingSearch;