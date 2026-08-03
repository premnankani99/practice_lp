import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e'];

export default function AdvancedAnalytics({ allRequests = [] }) {
  // 1. Status Ratios (Donut Chart)
  const statusData = useMemo(() => {
    let approved = 0, pending = 0, rejected = 0;
    allRequests.forEach(req => {
      if (req.status === 'approved') approved++;
      else if (req.status === 'pending') pending++;
      else if (req.status === 'rejected') rejected++;
    });
    return [
      { name: 'Approved', value: approved, color: '#10b981' }, 
      { name: 'Pending', value: pending, color: '#fbbf24' },  
      { name: 'Rejected', value: rejected, color: '#ef4444' }   
    ].filter(d => d.value > 0);
  }, [allRequests]);

  // 2. Leave Trends by Month (Bar Chart)
  const monthlyTrends = useMemo(() => {
    const months = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    allRequests.forEach(req => {
      if (!req.start_date) return;
      const date = new Date(req.start_date);
      const monthStr = monthNames[date.getMonth()];
      if (!months[monthStr]) months[monthStr] = 0;
      months[monthStr]++;
    });

    // Convert to array and sort according to standard month order
    return Object.keys(months).map(key => ({ name: key, count: months[key] })).sort((a, b) => {
        return monthNames.indexOf(a.name) - monthNames.indexOf(b.name);
    });
  }, [allRequests]);

  // 3. Leave Type Distribution (Pie Chart)
  const typeDistribution = useMemo(() => {
    const types = {};
    allRequests.forEach(req => {
      const typeName = req.leave_types?.name || 'Other';
      if (!types[typeName]) types[typeName] = 0;
      types[typeName]++;
    });
    
    return Object.keys(types).map((key, index) => ({
      name: key,
      count: types[key],
      fill: COLORS[index % COLORS.length]
    })).sort((a, b) => b.count - a.count);
  }, [allRequests]);

  if (allRequests.length === 0) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Status Ratios */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col h-[350px] transition-all hover:shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Request Status Ratio</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col h-[350px] transition-all hover:shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Leave Trends</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leave Types */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col h-[350px] transition-all hover:shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Leave Type Distribution</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="count"
                stroke="none"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
