import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Eye } from 'lucide-react';
import LeaveDetailsModal from './LeaveDetailsModal';
import { formatActiveDateRanges } from '../../utils/dateUtils';

const formatTime = (dateString) => {
    console.log("[Frontend Component] Rendering formatTime in ProcessedHistory.jsx");
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function ProcessedHistory({ processedRequests }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dateSort, setDateSort] = useState('desc'); // Default to recent first

  // Apply sorting
  const sortedRequests = [...processedRequests].sort((a, b) => {
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="mt-8 relative">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Processed Leave History</CardTitle>
          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-1.5 text-gray-600 bg-white focus:ring-2 focus:ring-[#9b72e5] focus:border-transparent outline-none"
          >
            <option value="desc">Sort by Date: Newest</option>
            <option value="asc">Sort by Date: Oldest</option>
          </select>
        </CardHeader>
        <CardContent>
          {processedRequests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No processed requests found.</p>
            </div>
          ) : (
            <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wide text-center">Employee</th>
                    <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wide text-center">Leave Type</th>
                    <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wide text-center">Dates</th>
                    <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wide text-center">Timings</th>
                    <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wide text-center">Status</th>
                    <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wide text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedRequests.map(req => {
                    const datesReq = formatActiveDateRanges(req.start_date, req.end_date, req.withdrawn_dates);
                    
                    const submitDate = formatTime(req.created_at);
                    const approvedDate = formatTime(req.approved_at);
                    const rejectedDate = formatTime(req.rejected_at);
                    const withdrawnDate = formatTime(req.withdrawn_at);
                    
                    return (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {req.profiles?.full_name} <br/>
                          <span className="text-sm text-gray-500 font-normal">{req.profiles?.email}</span>
                        </td>
                        <td className="px-5 py-4">{req.leave_types?.name}</td>
                        <td className="px-5 py-4">
                          {req.total_days} days <br/>
                          <span className="text-sm text-gray-500">{datesReq}</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 min-w-[200px] whitespace-nowrap">
                          <div className="space-y-1.5 bg-gray-50/50 p-2 rounded border border-gray-100">
                            <div><span className="font-semibold text-gray-700">Applied:</span> {submitDate}</div>
                            {approvedDate && <div><span className="font-semibold text-emerald-600">Approved:</span> {approvedDate}</div>}
                            {rejectedDate && <div><span className="font-semibold text-red-600">Rejected:</span> {rejectedDate}</div>}
                            {withdrawnDate && <div><span className="font-semibold text-gray-600">Withdrawn:</span> {withdrawnDate}</div>}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge className="capitalize" variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : req.status === 'cancelled' ? 'black' : 'secondary'}>
                            {req.status === 'cancelled' ? 'withdrawn' : req.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button 
                            onClick={() => setSelectedRequest(req)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#7e57c2] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-100"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                {sortedRequests.map(req => {
                  const datesReq = formatActiveDateRanges(req.start_date, req.end_date, req.withdrawn_dates);
                  
                  const submitDate = formatTime(req.created_at);
                  const approvedDate = formatTime(req.approved_at);
                  const rejectedDate = formatTime(req.rejected_at);
                  const withdrawnDate = formatTime(req.withdrawn_at);
                  
                  return (
                    <div key={req.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{req.profiles?.full_name}</h4>
                          <span className="text-sm text-gray-500">{req.profiles?.email}</span>
                        </div>
                        <Badge className="capitalize" variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : req.status === 'cancelled' ? 'black' : 'secondary'}>
                          {req.status === 'cancelled' ? 'withdrawn' : req.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 block mb-0.5">Leave Type</span>
                          <span className="text-sm text-gray-900 font-medium">{req.leave_types?.name}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 block mb-0.5">Days</span>
                          <span className="text-sm text-gray-900 font-medium">{req.total_days} days</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-xs font-semibold text-gray-500 block mb-0.5">Dates</span>
                        <span className="text-sm text-gray-700">{datesReq}</span>
                      </div>
                      
                      <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-lg border border-gray-100 text-xs text-gray-600 mb-4">
                        <div><span className="font-semibold text-gray-700">Applied:</span> {submitDate}</div>
                        {approvedDate && <div><span className="font-semibold text-emerald-600">Approved:</span> {approvedDate}</div>}
                        {rejectedDate && <div><span className="font-semibold text-red-600">Rejected:</span> {rejectedDate}</div>}
                        {withdrawnDate && <div><span className="font-semibold text-gray-600">Withdrawn:</span> {withdrawnDate}</div>}
                      </div>

                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#7e57c2] bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-100"
                      >
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {selectedRequest && (
        <LeaveDetailsModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
    </div>
  );
}
