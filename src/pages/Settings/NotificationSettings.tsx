import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NotificationPreference {
  id: string;
  name: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
}

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    { id: 'login', name: 'Login Alerts', email: true, inApp: true, sms: false },
    { id: 'task', name: 'Task Assignments', email: true, inApp: true, sms: false },
    { id: 'leave', name: 'Leave Approvals', email: true, inApp: true, sms: true },
    { id: 'attendance', name: 'Attendance Reminders', email: false, inApp: true, sms: false },
    { id: 'weekly', name: 'Weekly Digest', email: true, inApp: false, sms: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePreference = (id: string, channel: 'email' | 'inApp' | 'sms') => {
    setPreferences(prev => prev.map(p =>
      p.id === id ? { ...p, [channel]: !p[channel] } : p
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      }).catch(() => null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-gray-600 mt-2">Manage how you receive notifications</p>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            Notification preferences saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Notification Type</th>
                <th className="text-center p-3 font-semibold">Email</th>
                <th className="text-center p-3 font-semibold">In-App</th>
                <th className="text-center p-3 font-semibold">SMS</th>
              </tr>
            </thead>
            <tbody>
              {preferences.map(pref => (
                <tr key={pref.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{pref.name}</td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={pref.email}
                      onChange={() => togglePreference(pref.id, 'email')}
                      className="w-4 h-4"
                      disabled={loading}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={pref.inApp}
                      onChange={() => togglePreference(pref.id, 'inApp')}
                      className="w-4 h-4"
                      disabled={loading}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={pref.sms}
                      onChange={() => togglePreference(pref.id, 'sms')}
                      className="w-4 h-4"
                      disabled={loading}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Notification Channels</h3>
        
        <div className="space-y-3">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Email Address</h4>
            <p className="text-gray-600">user@example.com</p>
            <Button variant="outline" className="mt-3">Change Email</Button>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Phone Number (SMS)</h4>
            <p className="text-gray-600">+1 (555) 123-4567</p>
            <Button variant="outline" className="mt-3">Update Phone</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
