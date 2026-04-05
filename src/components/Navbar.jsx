// src/components/Navbar.jsx
import { useFinanceStore } from '../store/useFinanceStore';

export default function Navbar() {
  // We 'subscribe' to the role and setRole function from our Zustand brain
  const { role, setRole } = useFinanceStore();

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        {/* A simple, minimal logo area */}
        <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Ledger</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
          Role
        </span>
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900 block p-2 cursor-pointer outline-none transition-colors"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </nav>
  );
}