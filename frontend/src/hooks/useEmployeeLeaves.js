import { useState, useMemo } from 'react';
import { useMyRequests, useLeaveTypes, useWithdrawRequest, useAdjustLeave } from './useLeaves';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const useEmployeeLeaves = () => {
    console.log("[Frontend Component] Rendering useEmployeeLeaves in useEmployeeLeaves.js");
  const { data: myLeaves = [], isLoading: loadingLeaves } = useMyRequests();
  const { data: leaveTypes = [] } = useLeaveTypes();
  const withdrawMutation = useWithdrawRequest();
  const adjustMutation = useAdjustLeave();
  const toast = useToast();
  const { user } = useAuth();

  
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateSort, setDateSort] = useState('desc');
  const [withdrawTarget, setWithdrawTarget] = useState(null);

  const handleWithdraw = (datesToWithdraw = []) => {
    console.log("[Frontend Component] Rendering handleWithdraw in useEmployeeLeaves.js");
    if (withdrawTarget) {
      withdrawMutation.mutate({ requestId: withdrawTarget.id, datesToWithdraw }, {
        onSuccess: () => {
          toast.success("Leave withdrawal processed successfully.");
          setWithdrawTarget(null);
        },
        onError: (err) => {
          toast.error("Failed to withdraw request: " + err.message);
        }
      });
    }
  };

  const handleAdjust = (leaveId) => {
    console.log("[Frontend Component] Rendering handleAdjust in useEmployeeLeaves.js");
    adjustMutation.mutate({ leaveId }, {
      onSuccess: () => toast.success("Leave adjusted to Paid successfully!"),
      onError: (err) => toast.error(err.message)
    });
  };

  const filteredLeaves = useMemo(() => {
    let result = myLeaves.filter(req => {
      const matchStatus = statusFilter === 'All' || req.status === statusFilter.toLowerCase();
      const matchType = typeFilter === 'All' || req.leave_types?.name === typeFilter;
      return matchStatus && matchType;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.created_at || a.start_date).getTime();
      const dateB = new Date(b.created_at || b.start_date).getTime();
      return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [myLeaves, statusFilter, typeFilter, dateSort]);

  return {
    loadingLeaves,
    leaveTypes,
    withdrawMutation,
    adjustMutation,
    user,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    dateSort,
    setDateSort,
    withdrawTarget,
    setWithdrawTarget,
    handleWithdraw,
    handleAdjust,
    filteredLeaves
  };
};
