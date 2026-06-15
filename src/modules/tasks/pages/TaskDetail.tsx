import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { useStatusBadge } from '@hooks/useStatusBadge';
import { taskService } from '@services/taskService';

const TASK_STATUSES = ['Todo', 'InProgress', 'InReview', 'Blocked', 'Done', 'Cancelled'];

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBadgeClass, formatLabel } = useStatusBadge();
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const { data: task, isLoading, isError } = useApiQuery(
    ['tasks', id],
    () => taskService.getById(id!),
    { enabled: !!id }
  );

  const { mutate: updateStatus } = useApiMutation(
    (status: string) => taskService.updateStatus(id!, status),
    { invalidateKeys: [['tasks', id], ['tasks']] }
  );

  const { mutate: remove, isPending: removing } = useApiMutation(
    () => taskService.remove(id!),
    {
      invalidateKeys: [['tasks']],
      onSuccess: () => navigate('/tasks'),
    }
  );

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !task) return <div className="p-6 text-red-600">Task not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="text-gray-500 text-sm">{task.taskCode}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/tasks')}>Back</Button>
          <Link to={`/tasks/${id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button
            variant="destructive"
            disabled={removing}
            onClick={() => { if (confirm('Delete this task?')) remove(undefined); }}
          >
            {removing ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-4 border rounded-lg space-y-3">
          <h3 className="font-semibold text-lg">Task Details</h3>
          {task.description && <Field label="Description" value={task.description} />}
          <Field label="Project" value={task.project?.name} />
          <div className="flex gap-3 items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(v => !v)}
                  className={`px-2 py-1 rounded text-xs font-medium ${getBadgeClass(task.status)} cursor-pointer`}
                >
                  {formatLabel(task.status)} ▾
                </button>
                {showStatusMenu && (
                  <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg">
                    {TASK_STATUSES.map(s => (
                      <button
                        key={s}
                        className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                        onClick={() => { updateStatus(s); setShowStatusMenu(false); }}
                      >
                        {formatLabel(s)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Priority</p>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeClass(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg space-y-3">
          <h3 className="font-semibold text-lg">Assignment</h3>
          <Field
            label="Assigned To"
            value={task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}
          />
          {task.startDate && <Field label="Start Date" value={new Date(task.startDate).toLocaleDateString()} />}
          {task.dueDate && <Field label="Due Date" value={new Date(task.dueDate).toLocaleDateString()} />}
          {task.estimatedHours != null && <Field label="Estimated Hours" value={`${task.estimatedHours}h`} />}
          {task.actualHours != null && <Field label="Actual Hours" value={`${task.actualHours}h`} />}
          {task.createdAt && <Field label="Created" value={new Date(task.createdAt).toLocaleDateString()} />}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
