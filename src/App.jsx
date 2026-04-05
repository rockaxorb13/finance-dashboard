// src/App.jsx
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import InsightsBanner from './components/InsightsBanner'; // <-- Newly added import
import TransactionTable from './components/TransactionTable';
import Visualizations from './components/Visualizations';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-gray-200">
      <Navbar />
      
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-3 flex flex-col gap-8">
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Dashboard Overview</h2>
              <SummaryCards />
            </section>

            <InsightsBanner />

            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Transactions</h2>
              <TransactionTable />
            </section>
          </div>

          <div className="lg:col-span-2">
            <Visualizations />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;