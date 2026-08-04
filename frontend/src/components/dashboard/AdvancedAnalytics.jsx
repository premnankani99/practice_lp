import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Emerald, Amber, Red

export default function AdvancedAnalytics({ allRequests = [] }) {
  const [timeFilter, setTimeFilter] = useState('This Year');
  const [deptFilter, setDeptFilter] = useState('All Departments');

  // Extract unique departments for the dropdown
  const uniqueDepartments = useMemo(() => {
    const depts = new Set();
    allRequests.forEach(req => {
      if (req.employee?.department?.name) {
        depts.add(req.employee.department.name);
      }
    });
    return Array.from(depts);
  }, [allRequests]);

  // Filter requests based on selected Time and Department
  const filteredRequests = useMemo(() => {
    return allRequests.filter(req => {
      if (!req.start_date) return false;
      const date = new Date(req.start_date);
      const now = new Date();
      
      // 1. Time Check
      let timeMatch = true;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      
      if (timeFilter === 'This Year') {
        timeMatch = date.getFullYear() === currentYear;
      } else if (timeFilter === 'This Month') {
        timeMatch = date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      } else if (timeFilter === 'This Week') {
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))); // Monday
        firstDay.setHours(0, 0, 0, 0);
        
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6); // Sunday
        lastDay.setHours(23, 59, 59, 999);
        
        timeMatch = date >= firstDay && date <= lastDay;
      }
      
      // 2. Department Check
      let deptMatch = true;
      if (deptFilter !== 'All Departments') {
        const empDept = req.employee?.department?.name;
        deptMatch = empDept === deptFilter;
      }

      return timeMatch && deptMatch;
    });
  }, [allRequests, timeFilter, deptFilter]);
  
  // 1. Leave Trends by Month (Area Chart) - Using FILTERED data
  const monthlyTrends = useMemo(() => {
    const months = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize last 6 months to ensure chart looks good even with sparse data
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        let d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months[monthNames[d.getMonth()]] = 0;
    }

    filteredRequests.forEach(req => {
      const date = new Date(req.start_date);
      const monthStr = monthNames[date.getMonth()];
      if (months[monthStr] !== undefined) {
          months[monthStr]++;
      }
    });

    return Object.keys(months).map(key => ({ name: key, count: months[key] })).sort((a, b) => {
        return monthNames.indexOf(a.name) - monthNames.indexOf(b.name);
    });
  }, [filteredRequests]);

  // 2. Request Status Ratios (Donut Chart) - Using FILTERED data
  const statusDistribution = useMemo(() => {
    let approved = 0, pending = 0, rejected = 0;
    
    filteredRequests.forEach(req => {
      if (req.status === 'approved') approved++;
      else if (req.status === 'pending') pending++;
      else if (req.status === 'rejected') rejected++;
    });
    
    return [
      { name: 'Approved', value: approved, fill: '#10b981' }, 
      { name: 'Pending', value: pending, fill: '#fbbf24' },  
      { name: 'Rejected', value: rejected, fill: '#ef4444' }   
    ].filter(d => d.value > 0);
  }, [filteredRequests]);

  if (allRequests.length === 0) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* Left: Monthly Trends (Area Chart spanning 2 cols) */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-[400px]">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-semibold text-gray-900 text-lg">Leave Volume Trends</h3>
                <p className="text-xs text-gray-400 mt-1">Number of leave requests over time</p>
            </div>
            
            <div className="flex space-x-3">
              {/* Department Filter */}
              <select 
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Departments">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Time Filter */}
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="This Year">This Year</option>
                <option value="This Month">This Month</option>
                <option value="This Week">This Week</option>
              </select>
            </div>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrends" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrends)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right: Request Status (Donut Chart) */}
      <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-[400px]">
        <div className="mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">Request Status Ratios</h3>
            <p className="text-xs text-gray-400 mt-1">Breakdown of filtered application statuses</p>
        </div>
        
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={60} 
                iconType="circle" 
                wrapperStyle={{ fontSize: '13px', color: '#4b5563', paddingTop: '10px' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
