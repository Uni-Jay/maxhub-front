import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Alert, AlertDescription } from '@components/ui/alert';
import { useApiMutation } from '@hooks/useApiMutation';
import { useApiQuery } from '@hooks/useApiQuery';
import { staffService } from '@services/staffService';
import { departmentService, designationService } from '@services/departmentService';
import type { CreateStaffPayload } from '@services/staffService';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  employeeId: z.string().optional(),
  departmentId: z.coerce.number().min(1, 'Department is required'),
  designationId: z.coerce.number().min(1, 'Designation is required'),
  locationId: z.coerce.number().optional(),
  joiningDate: z.string().min(1, 'Joining date is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
});

type FormData = z.infer<typeof schema>;

export default function StaffForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { data: existing } = useApiQuery(
    ['staff', id],
    () => staffService.getById(id!),
    { enabled: isEdit }
  );

  const { data: departments } = useApiQuery(['departments'], () => departmentService.getAll());
  const { data: designations } = useApiQuery(['designations'], () => designationService.getAll());

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: existing ? {
      firstName: existing.firstName,
      lastName: existing.lastName,
      email: existing.email,
      phone: existing.phone,
      employeeId: existing.employeeId,
      departmentId: existing.departmentId,
      designationId: existing.designationId,
      locationId: existing.locationId,
      joiningDate: existing.joiningDate?.slice(0, 10) ?? '',
      dateOfBirth: existing.dateOfBirth?.slice(0, 10) ?? '',
      gender: existing.gender,
    } : undefined,
  });

  const { mutate: save, isPending, error } = useApiMutation(
    (data: CreateStaffPayload) =>
      isEdit ? staffService.update(id!, data) : staffService.create(data),
    {
      invalidateKeys: [['staff']],
      onSuccess: () => navigate('/staff'),
    }
  );

  const onSubmit = (data: FormData) => save(data as CreateStaffPayload);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{isEdit ? 'Edit Staff Member' : 'Add Staff Member'}</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="First Name" error={errors.firstName?.message}>
            <Input placeholder="John" {...register('firstName')} disabled={isPending} />
          </FormField>
          <FormField label="Last Name" error={errors.lastName?.message}>
            <Input placeholder="Doe" {...register('lastName')} disabled={isPending} />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="john@company.com" {...register('email')} disabled={isPending} />
          </FormField>
          <FormField label="Phone" error={errors.phone?.message}>
            <Input placeholder="+1234567890" {...register('phone')} disabled={isPending} />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Employee ID" error={errors.employeeId?.message}>
            <Input placeholder="EMP001 (auto-generated if blank)" {...register('employeeId')} disabled={isPending} />
          </FormField>
          <FormField label="Gender" error={errors.gender?.message}>
            <select {...register('gender')} disabled={isPending}
              className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
          <FormField label="Designation *" error={errors.designationId?.message}>
            <select {...register('designationId')} disabled={isPending}
              className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="">Select designation</option>
              {(designations ?? []).map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Joining Date" error={errors.joiningDate?.message}>
            <Input type="date" {...register('joiningDate')} disabled={isPending} />
          </FormField>
          <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
            <Input type="date" {...register('dateOfBirth')} disabled={isPending} />
          </FormField>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Staff')}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/staff')}>Cancel</Button>
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
