import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Alert, AlertDescription } from '@components/ui/alert';
import { useApiMutation } from '@hooks/useApiMutation';
import { useApiQuery } from '@hooks/useApiQuery';
import { projectService } from '@services/projectService';
import { departmentService } from '@services/departmentService';
import type { CreateProjectPayload } from '@services/projectService';

const schema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  projectCode: z.string().optional(),
  departmentId: z.coerce.number().min(1, 'Department is required'),
  projectManagerId: z.coerce.number().min(1, 'Project manager is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  budget: z.coerce.number().optional(),
  status: z.enum(['Planning', 'Active', 'OnHold', 'Completed', 'Cancelled', 'Archived']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { data: existing } = useApiQuery(
    ['projects', id],
    () => projectService.getById(id!),
    { enabled: isEdit }
  );

  const { data: departments } = useApiQuery(['departments'], () => departmentService.getAll());

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: existing ? {
      name: existing.name,
      description: existing.description ?? '',
      projectCode: existing.projectCode ?? '',
      departmentId: existing.departmentId,
      projectManagerId: existing.projectManagerId ?? 0,
      startDate: existing.startDate?.slice(0, 10) ?? '',
      endDate: existing.endDate?.slice(0, 10) ?? '',
      budget: existing.budget ?? undefined,
      status: existing.status as FormData['status'],
      priority: existing.priority as FormData['priority'],
    } : undefined,
  });

  const { mutate: save, isPending, error } = useApiMutation(
    (data: CreateProjectPayload) =>
      isEdit ? projectService.update(id!, data) : projectService.create(data),
    {
      invalidateKeys: [['projects']],
      onSuccess: () => navigate('/projects'),
    }
  );

  const onSubmit = (data: FormData) => save(data as CreateProjectPayload);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{isEdit ? 'Edit Project' : 'New Project'}</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Project Name *" error={errors.name?.message}>
          <Input placeholder="e.g. Website Redesign" {...register('name')} disabled={isPending} />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <textarea
            {...register('description')}
            disabled={isPending}
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm resize-none"
            placeholder="Project description..."
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Project Code" error={errors.projectCode?.message}>
            <Input placeholder="PRJ-001 (auto if blank)" {...register('projectCode')} disabled={isPending} />
          </FormField>
          <FormField label="Budget ($)" error={errors.budget?.message}>
            <Input type="number" placeholder="50000" {...register('budget')} disabled={isPending} />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Department *" error={errors.departmentId?.message}>
            <select {...register('departmentId')} disabled={isPending}
              className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="">Select department</option>
              {(departments ?? []).map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Project Manager ID *" error={errors.projectManagerId?.message}>
            <Input type="number" placeholder="Staff ID" {...register('projectManagerId')} disabled={isPending} />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Status" error={errors.status?.message}>
            <select {...register('status')} disabled={isPending}
              className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="">Select status</option>
              {['Planning', 'Active', 'OnHold', 'Completed', 'Cancelled', 'Archived'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Priority" error={errors.priority?.message}>
            <select {...register('priority')} disabled={isPending}
              className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="">Select priority</option>
              {['Low', 'Medium', 'High', 'Critical'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Start Date *" error={errors.startDate?.message}>
            <Input type="date" {...register('startDate')} disabled={isPending} />
          </FormField>
          <FormField label="End Date" error={errors.endDate?.message}>
            <Input type="date" {...register('endDate')} disabled={isPending} />
          </FormField>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Project')}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/projects')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
