'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Loader, Trash2, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

interface Member {
  _id: string;
  first_name: string;
  last_name: string;
  is_root?: boolean;
}

interface RelationshipData {
  person1_id: string;
  person2_id: string;
  relationship_type: string;
}

export default function TreeDiagnosticPage() {
  const [treeId, setTreeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [rootMember, setRootMember] = useState<Member | null>(null);
  const [disconnectedMembers, setDisconnectedMembers] = useState<Member[]>([]);
  const [connectedMembers, setConnectedMembers] = useState<Set<string>>(new Set());

  const findConnectedMembers = (
    members: Member[],
    relationships: RelationshipData[],
    rootId: string
  ): Set<string> => {
    const connected = new Set<string>();
    const queue = [rootId];
    connected.add(rootId);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      // Find all relationships involving current member
      relationships.forEach((rel) => {
        if (rel.person1_id === current && !connected.has(rel.person2_id)) {
          connected.add(rel.person2_id);
          queue.push(rel.person2_id);
        } else if (rel.person2_id === current && !connected.has(rel.person1_id)) {
          connected.add(rel.person1_id);
          queue.push(rel.person1_id);
        }
      });
    }

    return connected;
  };

  const handleCheckTree = async () => {
    if (!treeId.trim()) {
      setStatus('error');
      setMessage('Please enter a tree ID');
      return;
    }

    setChecking(true);
    setStatus('idle');

    try {
      // Fetch all members
      const membersRes = await fetch(`/api/members?treeId=${treeId}`);
      if (!membersRes.ok) {
        throw new Error('Failed to fetch members');
      }
      const members = await membersRes.json();

      if (!members || members.length === 0) {
        setStatus('error');
        setMessage('No members found in this tree');
        setChecking(false);
        return;
      }

      // Fetch all relationships
      const relationshipsRes = await fetch(`/api/relationships?treeId=${treeId}`);
      if (!relationshipsRes.ok) {
        throw new Error('Failed to fetch relationships');
      }
      const relationships = await relationshipsRes.json();

      // Find root
      const root = members.find((m: Member) => m.is_root);
      if (!root) {
        setStatus('error');
        setMessage('No root person found. Please set a root person first.');
        setChecking(false);
        return;
      }

      // Find connected members
      const connectedSet = findConnectedMembers(members, relationships, root._id);

      // Find disconnected members
      const disconnected = members.filter(
        (m: Member) => !connectedSet.has(m._id)
      );

      setAllMembers(members);
      setRootMember(root);
      setConnectedMembers(connectedSet);
      setDisconnectedMembers(disconnected);

      if (disconnected.length === 0) {
        setStatus('success');
        setMessage('✅ All members are properly connected!');
      } else {
        setStatus('error');
        setMessage(`Found ${disconnected.length} disconnected member(s)`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to check tree');
    } finally {
      setChecking(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete member');
      }

      // Remove from disconnected list
      setDisconnectedMembers((prev) =>
        prev.filter((m) => m._id !== memberId)
      );

      setStatus('success');
      setMessage('Member deleted successfully!');

      // If all disconnected members are deleted, show success
      if (disconnectedMembers.length === 1) {
        setStatus('success');
        setMessage('✅ All disconnected members removed!');
        setDisconnectedMembers([]);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to delete member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tree Diagnostic Tool</h1>
          <p className="text-gray-600">
            Find and fix disconnected family members
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
              disabled={checking}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              Found in the URL: /tree/[treeId]
            </p>
          </div>

          <Button
            onClick={handleCheckTree}
            disabled={checking || !treeId.trim()}
            className="w-full gap-2"
            size="lg"
          >
            {checking && <Loader className="h-4 w-4 animate-spin" />}
            {checking ? 'Checking Tree...' : 'Check Tree Structure'}
          </Button>

          {status === 'success' && disconnectedMembers.length === 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">{message}</p>
                <p className="text-sm text-green-700 mt-2">
                  Your family tree is properly structured!
                </p>
                <Link href={`/tree/${treeId}`}>
                  <Button className="mt-4 w-full" size="sm">
                    View Your Tree
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && disconnectedMembers.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">
                    Found {disconnectedMembers.length} Disconnected Member(s)
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    These members are not connected to the root person ({rootMember?.first_name} {rootMember?.last_name})
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Disconnected Members:</h3>
                {disconnectedMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        ID: {member._id}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteMember(member._id)}
                      disabled={loading}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="text-blue-900">
                  <strong>How to fix:</strong>
                </p>
                <ol className="list-decimal list-inside text-blue-800 mt-2 space-y-1">
                  <li>Click "Delete" to remove disconnected members, OR</li>
                  <li>Manually add relationships in your database to connect them to root</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus('idle');
                    setDisconnectedMembers([]);
                  }}
                >
                  Clear Results
                </Button>
                <Button onClick={handleCheckTree} disabled={checking}>
                  Check Again
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && disconnectedMembers.length === 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{message}</p>
              </div>
            </div>
          )}

          {rootMember && connectedMembers.size > 0 && (
            <div className="pt-4 border-t space-y-3">
              <h3 className="font-semibold text-gray-900">Tree Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{allMembers.length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-green-600">Connected</p>
                  <p className="text-2xl font-bold text-green-700">{connectedMembers.size}</p>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-xs text-red-600">Disconnected</p>
                  <p className="text-2xl font-bold text-red-700">{disconnectedMembers.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-blue-600">Root Person</p>
                  <p className="text-sm font-semibold text-blue-700 truncate">
                    {rootMember.first_name} {rootMember.last_name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-6 text-center">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
