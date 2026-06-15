import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApiQuery } from '@hooks/useApiQuery';
import { leaveService } from '@services/leaveService';
import type { LeaveBalance as LeaveBalanceType } from '@/types';

export default function LeaveBalance() {
  const { data, isLoading, isError } = useApiQuery(
    ['leave', 'balance'],
    () => leaveService.getBalance()
  );

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load leave balance.</div>;

  const leaveTypes = (data?.leaveTypes ?? []) as (LeaveBalanceType & { leaveType?: { name: string } })[];
  const totalPending = leaveTypes.reduce((s, b) => s + (b.pendingDays ?? 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leave Balance</h1>
        <p className="text-gray-600 mt-2">Leave balance for {new Date().getFullYear()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Days" value={data?.total ?? 0} className="bg-blue-50 border-blue-200 text-blue-900" />
        <StatCard label="Used" value={data?.used ?? 0} className="bg-green-50 border-green-200 text-green-900" />
        <StatCard label="Pending" value={totalPending} className="bg-yellow-50 border-yellow-200 text-yellow-900" />
        <StatCard label="Remaining" value={data?.available ?? 0} className="bg-purple-50 border-purple-200 text-purple-900" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Leave Type</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Used</th>
              <th className="text-left p-2">Pending</th>
              <th className="text-left p-2">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map(b => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{b.leaveType?.name ?? `Type ${b.leaveTypeId}`}</td>
                <td className="p-2 text-blue-600 font-semibold">{b.totalDays}</td>
                <td className="p-2 text-green-600 font-semibold">{b.usedDays}</td>
                <td className="p-2 text-yellow-600 font-semibold">{b.pendingDays ?? 0}</td>
                <td className="p-2 text-purple-600 font-semibold">{b.remainingDays}</td>
              </tr>
            ))}
            {leaveTypes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No leave balance data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Alert>
        <AlertDescription>
          Leave balance resets on January 1st every year. Contact HR for policy details.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function StatCard({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
