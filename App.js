import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Filter, CheckCircle, XCircle, BarChart2, PieChart as PieChartIcon } from 'lucide-react'; // Importing Lucide icons

// Main App component for the Claims Report Reconciliation System
const App = () => {
    // State to hold the raw claims data for Report A and Report B
    const [reportA, setReportA] = useState([]);
    const [reportB, setReportB] = useState([]);
    // State to hold the reconciled claims data
    const [reconciledData, setReconciledData] = useState([]);
    // State for filtering the displayed reconciliation results
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Matched', 'Mismatched'
    const [filterMismatchType, setFilterMismatchType] = useState('All'); // Specific mismatch types or 'All'
    const [searchTerm, setSearchTerm] = useState(''); // Search by Claim ID

    // Simulate fetching data on component mount
    useEffect(() => {
        // Simulate data for Report A
        const generateReportA = () => {
            const data = [];
            for (let i = 1; i <= 20; i++) {
                data.push({
                    claimId: `CLM${String(i).padStart(3, '0')}`,
                    policyNumber: `POL${Math.floor(Math.random() * 1000) + 100}`,
                    dateOfService: `2024-0${Math.floor(Math.random() * 9) + 1}-0${Math.floor(Math.random() * 9) + 1}`,
                    claimAmount: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
                    claimStatus: Math.random() > 0.5 ? 'Approved' : 'Pending',
                    insuredName: `Insured ${i}`,
                    providerName: `Provider ${Math.floor(Math.random() * 5) + 1}`
                });
            }
            // Add a missing claim for ReportB
            data.push({
                claimId: 'CLM021', policyNumber: 'POL999', dateOfService: '2024-07-15',
                claimAmount: 500.00, claimStatus: 'Approved', insuredName: 'Missing B', providerName: 'Prov X'
            });
            return data;
        };

        // Simulate data for Report B
        const generateReportB = (reportAData) => {
            const data = [];
            reportAData.forEach(claim => {
                let newClaim = { ...claim };
                // Introduce some mismatches for simulation
                if (Math.random() < 0.2) { // 20% chance of amount mismatch
                    newClaim.claimAmount = parseFloat((claim.claimAmount * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2)); // +/- 10%
                }
                if (Math.random() < 0.1) { // 10% chance of status mismatch
                    newClaim.claimStatus = claim.claimStatus === 'Approved' ? 'Denied' : 'Approved';
                }
                if (Math.random() < 0.05) { // 5% chance of date mismatch
                    const date = new Date(newClaim.dateOfService);
                    date.setDate(date.getDate() + (Math.random() > 0.5 ? 1 : -1));
                    newClaim.dateOfService = date.toISOString().split('T')[0];
                }
                data.push(newClaim);
            });
            // Add a missing claim for ReportA
            data.push({
                claimId: 'CLM022', policyNumber: 'POL888', dateOfService: '2024-08-01',
                claimAmount: 750.00, claimStatus: 'Pending', insuredName: 'Missing A', providerName: 'Prov Y'
            });
            return data;
        };

        const rA = generateReportA();
        const rB = generateReportB(rA);
        setReportA(rA);
        setReportB(rB);
    }, []);

    // Perform reconciliation whenever reportA or reportB changes
    useEffect(() => {
        const reconcileReports = () => {
            const results = [];
            const reportAMap = new Map(reportA.map(claim => [claim.claimId, claim]));
            const reportBMap = new Map(reportB.map(claim => [claim.claimId, claim]));

            // Iterate through all unique claim IDs from both reports
            const allClaimIds = new Set([...reportAMap.keys(), ...reportBMap.keys()]);

            allClaimIds.forEach(claimId => {
                const claimA = reportAMap.get(claimId);
                const claimB = reportBMap.get(claimId);

                let reconciliationStatus = 'Matched';
                let mismatchType = null;
                const discrepancies = [];

                if (!claimA) {
                    reconciliationStatus = 'Mismatched';
                    mismatchType = 'Missing in Report A';
                    discrepancies.push('Missing in Report A');
                } else if (!claimB) {
                    reconciliationStatus = 'Mismatched';
                    mismatchType = 'Missing in Report B';
                    discrepancies.push('Missing in Report B');
                } else {
                    // Check for field-level mismatches if both claims exist
                    if (claimA.policyNumber !== claimB.policyNumber) {
                        reconciliationStatus = 'Mismatched';
                        discrepancies.push('Policy Number Mismatch');
                    }
                    if (claimA.dateOfService !== claimB.dateOfService) {
                        reconciliationStatus = 'Mismatched';
                        discrepancies.push('Date of Service Mismatch');
                    }
                    if (claimA.claimAmount !== claimB.claimAmount) {
                        reconciliationStatus = 'Mismatched';
                        discrepancies.push('Claim Amount Mismatch');
                    }
                    if (claimA.claimStatus !== claimB.claimStatus) {
                        reconciliationStatus = 'Mismatched';
                        discrepancies.push('Claim Status Mismatch');
                    }
                    // If there are discrepancies, combine them into a single mismatchType string
                    if (discrepancies.length > 0) {
                        mismatchType = discrepancies.join(', ');
                    }
                }

                results.push({
                    claimId: claimId,
                    reportA_policyNumber: claimA?.policyNumber || '-',
                    reportB_policyNumber: claimB?.policyNumber || '-',
                    reportA_dateOfService: claimA?.dateOfService || '-',
                    reportB_dateOfService: claimB?.dateOfService || '-',
                    reportA_claimAmount: claimA?.claimAmount || '-',
                    reportB_claimAmount: claimB?.claimAmount || '-',
                    reportA_claimStatus: claimA?.claimStatus || '-',
                    reportB_claimStatus: claimB?.claimStatus || '-',
                    reconciliationStatus: reconciliationStatus,
                    mismatchType: mismatchType
                });
            });
            setReconciledData(results);
        };

        if (reportA.length > 0 || reportB.length > 0) {
            reconcileReports();
        }
    }, [reportA, reportB]);

    // Filtered data for display based on user selections
    const filteredReconciledData = useMemo(() => {
        return reconciledData.filter(item => {
            const matchesStatus = filterStatus === 'All' || item.reconciliationStatus === filterStatus;
            const matchesMismatchType = filterMismatchType === 'All' || item.mismatchType === filterMismatchType;
            const matchesSearchTerm = item.claimId.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesMismatchType && matchesSearchTerm;
        });
    }, [reconciledData, filterStatus, filterMismatchType, searchTerm]);

    // Data for the Pie Chart (Matched vs. Mismatched)
    const statusData = useMemo(() => {
        const matchedCount = reconciledData.filter(d => d.reconciliationStatus === 'Matched').length;
        const mismatchedCount = reconciledData.filter(d => d.reconciliationStatus === 'Mismatched').length;
        return [
            { name: 'Matched', value: matchedCount },
            { name: 'Mismatched', value: mismatchedCount }
        ];
    }, [reconciledData]);

    // Data for the Bar Chart (Mismatch Types)
    const mismatchTypeData = useMemo(() => {
        const counts = {};
        reconciledData.forEach(item => {
            if (item.mismatchType) {
                // Handle multiple mismatch types in one string
                item.mismatchType.split(', ').forEach(type => {
                    counts[type] = (counts[type] || 0) + 1;
                });
            }
        });
        return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
    }, [reconciledData]);

    // Colors for the Pie Chart
    const COLORS = ['#4CAF50', '#F44336']; // Green for Matched, Red for Mismatched

    // Extract unique mismatch types for the filter dropdown
    const uniqueMismatchTypes = useMemo(() => {
        const types = new Set();
        reconciledData.forEach(item => {
            if (item.mismatchType) {
                item.mismatchType.split(', ').forEach(type => types.add(type));
            }
        });
        return ['All', ...Array.from(types).sort()];
    }, [reconciledData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans antialiased">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

            {/* Header Section */}
            <header className="bg-gradient-to-r from-blue-700 to-purple-800 text-white p-6 rounded-xl shadow-2xl mb-8 transform transition-all duration-300 hover:scale-[1.005]">
                <h1 className="text-4xl font-extrabold text-center mb-2 tracking-wide">Claims Report Reconciliation</h1>
                <p className="text-center text-xl opacity-90 font-light">Automated detection of mismatches for enhanced QA</p>
            </header>

            {/* Dashboard Overview */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">Total Claims</h2>
                    <p className="text-5xl font-extrabold text-blue-700">{reconciledData.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2"><CheckCircle className="text-green-600" size={24} /> Matched Claims</h2>
                    <p className="text-5xl font-extrabold text-green-700">{statusData.find(d => d.name === 'Matched')?.value || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2"><XCircle className="text-red-600" size={24} /> Mismatched Claims</h2>
                    <p className="text-5xl font-extrabold text-red-700">{statusData.find(d => d.name === 'Mismatched')?.value || 0}</p>
                </div>
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-xl transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4 flex items-center justify-center gap-2"><PieChartIcon className="text-indigo-600" size={28} /> Reconciliation Status Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="transition-all duration-300 hover:opacity-80" />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} claims`} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-xl transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4 flex items-center justify-center gap-2"><BarChart2 className="text-teal-600" size={28} /> Mismatch Types Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={mismatchTypeData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} interval={0} tick={{ fill: '#555', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#555', fontSize: 12 }} />
                            <Tooltip formatter={(value) => `${value} instances`} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="count" fill="#6366F1" name="Number of Mismatches" radius={[8, 8, 0, 0]} className="transition-all duration-300 hover:fill-indigo-700" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Reconciliation Results Table */}
            <section className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detailed Reconciliation Results</h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-6 mb-8 items-end">
                    <div className="flex flex-col flex-1 min-w-[180px]">
                        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Filter size={16} /> Filter by Status:</label>
                        <div className="relative">
                            <select
                                id="statusFilter"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 transition-all duration-200 hover:border-blue-400"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Matched">Matched</option>
                                <option value="Mismatched">Mismatched</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 min-w-[220px]">
                        <label htmlFor="mismatchTypeFilter" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Filter size={16} /> Filter by Mismatch Type:</label>
                        <div className="relative">
                            <select
                                id="mismatchTypeFilter"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 transition-all duration-200 hover:border-blue-400"
                                value={filterMismatchType}
                                onChange={(e) => setFilterMismatchType(e.target.value)}
                            >
                                {uniqueMismatchTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <label htmlFor="searchClaimId" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Search size={16} /> Search by Claim ID:</label>
                        <input
                            type="text"
                            id="searchClaimId"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400"
                            placeholder="Enter Claim ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Claim ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report A Policy #</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report B Policy #</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report A Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report B Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report A Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report B Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report A Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report B Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reconciliation Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mismatch Type</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredReconciledData.length > 0 ? (
                                filteredReconciledData.map((item, index) => (
                                    <tr key={index} className={`transition-all duration-150 ease-in-out ${item.reconciliationStatus === 'Mismatched' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.claimId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.reportA_policyNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.reportB_policyNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.reportA_dateOfService}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.reportB_dateOfService}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.reportA_claimAmount !== '-' ? `$${item.reportA_claimAmount.toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.reportB_claimAmount !== '-' ? `$${item.reportB_claimAmount.toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.reportA_claimStatus}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.reportB_claimStatus}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.reconciliationStatus === 'Matched' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.reconciliationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-medium">{item.mismatchType || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="px-6 py-4 text-center text-gray-500 text-lg">No data to display based on current filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default App;
