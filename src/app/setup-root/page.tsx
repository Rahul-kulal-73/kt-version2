'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

function SetupRootContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTreeId = searchParams.get('treeId');

  const [treeId, setTreeId] = useState(urlTreeId || '');
  const [loading, setLoading] = useState(false);
  const [autoSetupAttempted, setAutoSetupAttempted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Auto-setup if treeId provided and user is logged in
  useEffect(() => {
    const autoSetup = async () => {
      if (!urlTreeId || !user || autoSetupAttempted) return;

      setAutoSetupAttempted(true);
      setLoading(true);

      try {
        // Fetch all members in the tree
        const membersRes = await fetch(`/api/members?treeId=${urlTreeId}`);
        if (!membersRes.ok) {
          throw new Error('Failed to fetch members');
        }

        const members = await membersRes.json();

        if (!members || members.length === 0) {
          setStatus('error');
          setMessage('No members found in this tree. Please add members first.');
          setLoading(false);
          return;
        }

        // Check if there's already a root person
        const existingRoot = members.find((m: any) => m.is_root);
        if (existingRoot) {
          setStatus('success');
          setMessage(
            `✅ Root person already set: "${existingRoot.first_name} ${existingRoot.last_name}"`
          );
          setTimeout(() => {
            router.push(`/tree/${urlTreeId}`);
          }, 2000);
          setLoading(false);
          return;
        }

        // Try to find a member matching the current user
        const currentUserMember = members.find(
          (m: any) =>
            m.first_name === user.first_name && m.last_name === user.last_name
        );

        let memberToSetAsRoot = currentUserMember || members[0];

        // Set as root
        const updateRes = await fetch(`/api/members/${memberToSetAsRoot._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_root: true }),
        });

        if (!updateRes.ok) {
          throw new Error('Failed to update member');
        }

        setStatus('success');
        setMessage(
          `✅ Successfully set "${memberToSetAsRoot.first_name} ${memberToSetAsRoot.last_name}" as the root person!`
        );

        // Redirect to tree after 2 seconds
        setTimeout(() => {
          router.push(`/tree/${urlTreeId}`);
        }, 2000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error instanceof Error ? error.message : 'Failed to set root person'
        );
      } finally {
        setLoading(false);
      }
    };

    autoSetup();
  }, [urlTreeId, user, autoSetupAttempted, router]);

  const handleSetRoot = async () => {
    if (!treeId.trim()) {
      setStatus('error');
      setMessage('Please enter a tree ID');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      // Fetch all members in the tree
      const membersRes = await fetch(`/api/members?treeId=${treeId}`);
      if (!membersRes.ok) {
        throw new Error('Failed to fetch members');
      }

      const members = await membersRes.json();

      if (!members || members.length === 0) {
        setStatus('error');
        setMessage('No members found in this tree. Please add members first.');
        setLoading(false);
        return;
      }

      // Set the first member as root
      const firstMember = members[0];
      const updateRes = await fetch(`/api/members/${firstMember._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_root: true }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update member');
      }

      setStatus('success');
      setMessage(
        `✅ Successfully set "${firstMember.first_name} ${firstMember.last_name}" as the root person!`
      );
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Failed to set root person'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Root Person</h1>
        <p className="text-gray-600">
          Set one member as the root (starting point) of your family tree
        </p>
      </div>

      <Card className="p-6 space-y-6 shadow-lg">
        <div>
          <Label htmlFor="treeId" className="text-sm font-medium">
            Tree ID
          </Label>
          <Input
            id="treeId"
            placeholder="Paste your tree ID here"
            value={treeId}
            onChange={(e) => setTreeId(e.target.value)}
            disabled={loading}
            className="mt-2"
          />
          <p className="text-xs text-gray-500 mt-2">
            You can find this in the URL: /tree/[treeId]
          </p>
        </div>

        <Button
          onClick={handleSetRoot}
          disabled={loading || !treeId.trim()}
          className="w-full gap-2"
          size="lg"
        >
          {loading && <Loader className="h-4 w-4 animate-spin" />}
          {loading ? 'Setting Root...' : 'Set First Member as Root'}
        </Button>

        {status === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">{message}</p>
              <p className="text-sm text-green-700 mt-2">
                You can now view your family tree!
              </p>
              <Link href={`/tree/${treeId}`}>
                <Button className="mt-4 w-full" size="sm">
                  View Your Tree
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{message}</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t space-y-3">
          <h3 className="font-semibold text-gray-900">Quick Guide</h3>
          <ol className="text-sm text-gray-600 space-y-2">
            <li className="flex gap-2">
              <span className="font-semibold text-gray-900">1.</span>
              <span>Find your tree ID in the URL bar (e.g., 507f1f77bcf86cd799439011)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-gray-900">2.</span>
              <span>Paste it into the field above</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-gray-900">3.</span>
              <span>Click "Set First Member as Root"</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-gray-900">4.</span>
              <span>View your family tree!</span>
            </li>
          </ol>
        </div>

        <div className="pt-4 border-t bg-blue-50 p-3 rounded">
          <p className="text-xs text-blue-700">
            <strong>What's a root person?</strong> The root person is the starting point of your family tree. All other family members should be connected to this person through relationships.
          </p>
        </div>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

export default function SetupRootPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
      <Suspense fallback={<div className="flex justify-center p-8"><Loader className="animate-spin h-8 w-8" /></div>}>
        <SetupRootContent />
      </Suspense>
    </div>
  );
}
