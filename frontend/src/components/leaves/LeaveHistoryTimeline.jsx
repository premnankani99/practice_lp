import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function LeaveHistoryTimeline({ leaves = [] }) {
  if (!leaves || leaves.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center h-full flex items-center justify-center">
        <p className="text-gray-500 font-medium">No leave history found for this employee.</p>
      </div>
    );
  }

  // Sort leaves by start_date descending (newest first)
  const sortedLeaves = [...leaves].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Leave History</h2>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-4">
          {sortedLeaves.map((leave, idx) => {
            const isApproved = leave.status === 'approved';
            const isRejected = leave.status === 'rejected';
            const isPending = leave.status === 'pending';
            
            // Format dates e.g. "29 September 2023 - 30 September 2023"
            const startDate = new Date(leave.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            const endDate = new Date(leave.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            const dateStr = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
            
            let statusColor = 'text-gray-500 bg-gray-50 border-gray-200';
            let iconColor = 'text-gray-400';
            let Icon = Clock;
            
            if (isApproved) {
              statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
              iconColor = 'text-emerald-500';
              Icon = CheckCircle2;
            } else if (isRejected) {
              statusColor = 'text-red-700 bg-red-50 border-red-100';
              iconColor = 'text-red-500';
              Icon = XCircle;
            } else if (isPending) {
              statusColor = 'text-amber-700 bg-amber-50 border-amber-100';
              iconColor = 'text-amber-500';
              Icon = Clock;
            }

            return (
              <div key={leave.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors bg-gray-50/30">
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 ${iconColor}`}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{dateStr}</h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1.5">
                      <span className="truncate max-w-[200px] sm:max-w-xs">{leave.reason || leave.leave_type}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium text-gray-600">{leave.total_days} day{leave.total_days > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status label */}
                <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                  <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${statusColor}`}>
                    {leave.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
