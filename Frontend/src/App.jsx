import React, { useState, useEffect } from "react";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 text-red-800 rounded-lg">
          <h1 className="text-xl font-bold">Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState("");

  // Fetch API with pagination
  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    setUiError("");

    try {
      const res = await fetch(`https://reqres.in/api/users?page=${pageNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "reqres-free-v1",
        },
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUiError("Failed to load users. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Search filter
  const filteredUsers = (users || []).filter((u) => {
    const term = search.toLowerCase();
    return (
      u.first_name.toLowerCase().includes(term) ||
      u.last_name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  // Domain filter
  const domainFiltered = filterDomain
    ? filteredUsers.filter((u) => u.email.endsWith(filterDomain))
    : filteredUsers;

  // Sorting
  const sortedUsers = [...domainFiltered].sort((a, b) => {
    if (!sortField) return 0;
    return a[sortField].localeCompare(b[sortField]);
  });

  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-5">

        <h1 className="text-3xl font-bold mb-6 text-center">ReqRes Users</h1>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-3 rounded-lg shadow-sm"
          />

          <select
            onChange={(e) => setSortField(e.target.value)}
            className="w-full border p-3 rounded-lg shadow-sm"
          >
            <option value="">Sort By</option>
            <option value="first_name">First Name</option>
            <option value="email">Email</option>
          </select>

          <select
            onChange={(e) => setFilterDomain(e.target.value)}
            className="w-full border p-3 rounded-lg shadow-sm"
          >
            <option value="">Email Domain</option>
            <option value="@reqres.in">@reqres.in</option>
          </select>

        </div>

        {/* UI Error */}
        {uiError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {uiError}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Avatar</th>
                  <th className="p-3 border">First Name</th>
                  <th className="p-3 border">Last Name</th>
                  <th className="p-3 border">Email</th>
                </tr>
              </thead>

              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                    <td className="p-3 border">{user.first_name}</td>
                    <td className="p-3 border">{user.last_name}</td>
                    <td className="p-3 border">{user.email}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg text-white 
              ${page === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Prev
          </button>

          <span className="text-lg font-medium">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-lg text-white 
              ${page === totalPages ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Next
          </button>

        </div>
      </div>
    </ErrorBoundary>
  );
}
