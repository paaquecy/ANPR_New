import React, { useState, useMemo } from 'react';

interface PendingApproval {
  id: string;
  userName: string;
  email: string;
  role: string;
  requestDate: string;
}

interface PendingApprovalsTableProps {
  searchQuery: string;
  filterQuery: string;
  statusFilter: string;
}

const PendingApprovalsTable: React.FC<PendingApprovalsTableProps> = ({
  searchQuery,
  filterQuery,
  statusFilter
}) => {
  const [approvals, setApprovals] = useState<PendingApproval[]>([
    {
      id: '1',
      userName: 'John Doe',
      email: 'john.doe@example.com',
      role: 'User',
      requestDate: '2024-07-20'
    },
    {
      id: '2',
      userName: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'User',
      requestDate: '2024-07-19'
    },
    {
      id: '3',
      userName: 'Peter Jones',
      email: 'peter.jones@example.com',
      role: 'Admin',
      requestDate: '2024-07-18'
    },
    {
      id: '4',
      userName: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'User',
      requestDate: '2024-07-17'
    },
    {
      id: '5',
      userName: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'Moderator',
      requestDate: '2024-07-16'
    }
  ]);

  const filteredApprovals = useMemo(() => {
    return approvals.filter(approval => {
      const matchesSearch = searchQuery === '' || 
        approval.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        approval.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterQuery === '' ||
        approval.userName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        approval.email.toLowerCase().includes(filterQuery.toLowerCase());
      
      return matchesSearch && matchesFilter;
    });
  }, [approvals, searchQuery, filterQuery]);

  const handleApprove = (approval: PendingApproval) => {
    console.log(`Approve clicked for ${approval.userName}`);
    setApprovals(prev => prev.filter(a => a.id !== approval.id));
  };

  const handleReject = (approval: PendingApproval) => {
    console.log(`Reject clicked for ${approval.userName}`);
    setApprovals(prev => prev.filter(a => a.id !== approval.id));
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                USER NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EMAIL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROLE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                REQUEST DATE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApprovals.map((approval, index) => (
              <tr 
                key={approval.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {approval.userName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {approval.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${approval.role === 'Admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : approval.role === 'Moderator'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                    }
                  `}>
                    {approval.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {approval.requestDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(approval)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(approval)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredApprovals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pending approvals found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovalsTable;