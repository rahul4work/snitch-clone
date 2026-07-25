import React from "react";
import SideNavBar from "../components/SideNavBar.jsx";

const recentOrders = [
  {
    id: "1024",
    customer: "Rahul Sharma",
    amount: "$129",
    status: "Completed",
    date: "2024-01-15",
  },
  {
    id: "1025",
    customer: "Priya Singh",
    amount: "$89",
    status: "Pending",
    date: "2024-01-14",
  },
  {
    id: "1026",
    customer: "Amit Verma",
    amount: "$249",
    status: "Completed",
    date: "2024-01-13",
  },
  {
    id: "1027",
    customer: "Sneha Gupta",
    amount: "$49",
    status: "Pending",
    date: "2024-01-12",
  },
  {
    id: "1028",
    customer: "Ravi Kumar",
    amount: "$189",
    status: "Completed",
    date: "2024-01-11",
  },
];

const Dashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideNavBar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shrink-0 shadow-xs">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Dashboard
            </h1>
            <div className="mx-3 text-gray-600"> | </div>
            <p className="text-sm text-gray-500 font-medium">
              Welcome to your store overview
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-4 bg-[#f8f9fa]">
          <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-4 text-center hover:bg-orange-50 transition-colors">
                <h3 className="text-xl font-bold text-orange-600">142</h3>
                <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
                  Total Orders
                </p>
              </div>

              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 text-center hover:bg-orange-50 transition-colors">
                <h3 className="text-xl font-bold text-orange-600">98</h3>
                <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
                  Completed
                </p>
              </div>

              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 text-center hover:bg-orange-50 transition-colors">
                <h3 className="text-xl font-bold text-orange-600">₹12,450</h3>
                <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
                  Revenue
                </p>
              </div>

              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 text-center hover:bg-orange-50 transition-colors">
                <h3 className="text-xl font-bold text-orange-600">45</h3>
                <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
                  Pending
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
                Recent Orders
              </h2>

              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-5 font-medium">Order ID</th>
                      <th className="py-3 px-5 font-medium">Customer</th>
                      <th className="py-3 px-5 font-medium">Amount</th>
                      <th className="py-3 px-5 font-medium text-center">
                        Status
                      </th>
                      <th className="py-3 px-5 font-medium">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 px-5 font-semibold text-gray-900">
                          #{order.id}
                        </td>
                        <td className="py-3 px-5 text-gray-700">
                          {order.customer}
                        </td>
                        <td className="py-3 px-5 font-bold text-gray-900">
                          {order.amount}
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span
                            className={`
                            inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                            ${
                              order.status === "Completed"
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-yellow-50 text-yellow-600 border-yellow-100"
                            }
                          `}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-gray-500">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
