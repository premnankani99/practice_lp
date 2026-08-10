import { TreePine, Sun, Trash2, Loader2 } from 'lucide-react';

export default function HolidaysTable({ sortedHolidays, currentYear, isHolidayAdmin, onDelete, isDeleting }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
      {sortedHolidays.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">No holidays configured yet for {currentYear}.</p>
        </div>
      ) : (
        <>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full text-base text-left">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-600 uppercase tracking-wide text-sm">Date</th>
                <th className="px-6 py-5 font-semibold text-gray-600 uppercase tracking-wide text-sm">Day</th>
                <th className="px-6 py-5 font-semibold text-gray-600 uppercase tracking-wide text-sm">Holiday Name</th>
                {isHolidayAdmin && (
                  <th className="px-6 py-5 font-semibold text-gray-600 uppercase tracking-wide text-sm text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedHolidays.map((holiday, idx) => {
                const isPast = holiday.date < new Date(new Date().setHours(0,0,0,0));
                return (
                  <tr key={holiday.id || idx} className={`hover:bg-purple-50/50 transition-colors group ${isPast ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium group-hover:text-[#7e57c2] transition-colors">
                      {holiday.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {holiday.date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium flex items-center gap-2">
                      {!isPast && <Sun className="w-4 h-4 text-amber-500 group-hover:animate-spin-slow" />}
                      {holiday.name}
                      {isPast && <span className="ml-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase tracking-wider font-semibold">Past</span>}
                    </td>
                    {isHolidayAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => onDelete(holiday.id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Holiday"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100 overflow-y-auto flex-1">
          {sortedHolidays.map((holiday, idx) => {
            const isPast = holiday.date < new Date(new Date().setHours(0,0,0,0));
            return (
              <div key={holiday.id || idx} className={`p-4 bg-white hover:bg-gray-50 transition-colors ${isPast ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {!isPast && <Sun className="w-5 h-5 text-amber-500" />}
                    <h4 className="font-bold text-gray-900 text-lg">{holiday.name}</h4>
                  </div>
                  {isPast && <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase tracking-wider font-semibold">Past</span>}
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{holiday.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>{holiday.date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                  </div>
                  
                  {isHolidayAdmin && (
                    <button 
                      onClick={() => onDelete(holiday.id)}
                      disabled={isDeleting}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete Holiday"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}
