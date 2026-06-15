import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/services/auth.api';

const verifyEmailSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const email = searchParams.get('email') || '';

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      setLoading(true);
      setError(null);

      await authApi.verifyOTP(data.code);
      
      alert('Email verified! Redirecting to login...');
      navigate('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError(null);
      
      await authApi.sendOTP(email, 'email');
      alert('Verification code sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Verify Email</h1>
        <p className="text-gray-600">Enter the verification code sent to {email}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Verification Code</label>
          <Input
            placeholder="000000"
            {...register('code')}
            disabled={loading}
            maxLength={6}
          />
          {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Didn't receive the code?{' '}
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-blue-600 hover:underline disabled:opacity-50"
        >
          {resending ? 'Sending...' : 'Resend'}
        </button>
      </div>
    </div>
  );
}
