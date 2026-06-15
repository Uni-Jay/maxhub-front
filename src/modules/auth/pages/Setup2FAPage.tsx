import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/services/auth.api';

export default function Setup2FAPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'TOTP' | 'SMS' | 'EMAIL'>('TOTP');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'method' | 'setup' | 'verify' | 'complete'>('method');

  const handleSetupMethod = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.setup2FA(method);
      
      if (response.qrCode) setQrCode(response.qrCode);
      if (response.secret) setSecret(response.secret);
      
      setStep('setup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.verify2FASetup(verificationCode);
      setBackupCodes(response.backupCodes);
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'method') {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Setup Two-Factor Authentication</h1>
          <p className="text-gray-600">Choose your preferred authentication method</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="method"
              value="TOTP"
              checked={method === 'TOTP'}
              onChange={(e) => setMethod(e.target.value as any)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Authenticator App</div>
              <div className="text-sm text-gray-600">Use an app like Google Authenticator</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="method"
              value="SMS"
              checked={method === 'SMS'}
              onChange={(e) => setMethod(e.target.value as any)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">SMS</div>
              <div className="text-sm text-gray-600">Receive codes via text message</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="method"
              value="EMAIL"
              checked={method === 'EMAIL'}
              onChange={(e) => setMethod(e.target.value as any)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Email</div>
              <div className="text-sm text-gray-600">Receive codes via email</div>
            </div>
          </label>
        </div>

        <Button onClick={handleSetupMethod} className="w-full" disabled={loading}>
          {loading ? 'Setting up...' : 'Continue'}
        </Button>

        <div className="text-center text-sm">
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Skip for now
          </a>
        </div>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Setup {method === 'TOTP' ? 'Authenticator' : method}</h1>
          <p className="text-gray-600">Follow the instructions below</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {method === 'TOTP' && qrCode && (
          <div className="text-center space-y-4">
            <img src={qrCode} alt="QR Code" className="w-full max-w-xs mx-auto" />
            {secret && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Or enter this code manually:</p>
                <code className="block bg-gray-100 p-3 rounded text-sm font-mono break-all">{secret}</code>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Scan this QR code with your authenticator app or enter the code manually
            </p>
          </div>
        )}

        {(method === 'SMS' || method === 'EMAIL') && (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              A verification code will be sent to your {method === 'SMS' ? 'phone' : 'email'}
            </p>
          </div>
        )}

        <Button onClick={() => setStep('verify')} className="w-full">
          I've set it up, continue
        </Button>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verify Setup</h1>
          <p className="text-gray-600">Enter the verification code</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Verification Code</label>
          <Input
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={loading}
            maxLength={6}
          />
        </div>

        <Button onClick={handleVerify} className="w-full" disabled={loading || !verificationCode}>
          {loading ? 'Verifying...' : 'Verify & Complete'}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Two-Factor Authentication Enabled</h1>
        <p className="text-gray-600">Your account is now protected</p>
      </div>

      <Alert className="border-green-200 bg-green-50">
        <AlertDescription className="text-green-800">
          Two-factor authentication has been successfully enabled on your account.
        </AlertDescription>
      </Alert>

      {backupCodes.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Backup Codes</h3>
            <p className="text-sm text-gray-600 mb-3">
              Save these codes in a safe place. You can use them if you lose access to your authentication method.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-1">
              {backupCodes.map((code, i) => (
                <div key={i}>{code}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button onClick={() => navigate('/dashboard')} className="w-full">
        Go to Dashboard
      </Button>
    </div>
  );
}
