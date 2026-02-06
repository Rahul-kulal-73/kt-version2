'use client';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LeftSection from '@/components/dashboard/LeftSection';
import RightSection from '@/components/dashboard/RightSection';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [familyTrees, setFamilyTrees] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTree = familyTrees.length > 0 ? familyTrees[0] : null;

  useEffect(() => {
    const fetchTrees = async () => {
      if (user?._id) {
        try {
          const res = await fetch(`/api/trees?userId=${user._id}`);
          if (res.ok) {
            const data = await res.json();
            const mapped = data.map((t: any) => ({
              id: t._id, // Map _id to id
              name: t.name,
              description: t.description,
              updated_at: t.updated_at
            }));
            setFamilyTrees(mapped);
          }
        } catch (error) {
          console.error('Failed to fetch trees', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchTrees();
  }, [user]);

  const [relationships, setRelationships] = useState<any[]>([]);

  useEffect(() => {
    const fetchTreeData = async () => {
      if (activeTree?.id) {
        try {
          const res = await fetch(`/api/trees/${activeTree.id}`);
          if (res.ok) {
            const data = await res.json();

            // Map Members
            const mappedMembers = data.members.map((m: any) => ({
              id: m._id,
              first_name: m.first_name,
              last_name: m.last_name,
              gender: m.gender,
              birth_date: m.birth_date,
              death_date: m.death_date,
              photo_url: m.photo_url,
              is_root: m.is_root
            }));
            setFamilyMembers(mappedMembers);

            // Map Relationships
            const mappedRelationships = data.relationships.map((r: any) => ({
              id: r._id,
              person1_id: r.person1_id,
              person2_id: r.person2_id,
              relationship_type: r.relationship_type
            }));
            setRelationships(mappedRelationships);

          }
        } catch (error) {
          console.error('Failed to fetch tree data', error);
        }
      } else {
        setFamilyMembers([]);
        setRelationships([]);
      }
    };
    fetchTreeData();
  }, [activeTree]);

  const handleCreateTree = async () => {
    if (user?._id) {
      try {
        const res = await fetch('/api/trees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user._id,
            name: `${user.first_name}'s Family Tree`,
            description: 'My family heritage'
          })
        });

        if (res.ok) {
          const newTree = await res.json();
          setFamilyTrees(prev => [...prev, {
            id: newTree._id,
            name: newTree.name,
            description: newTree.description,
            updated_at: newTree.updated_at
          }]);
          toast.success('Family tree created');
        }
      } catch (error) {
        console.error('Failed to create tree', error);
        toast.error('Failed to create tree');
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <DashboardHeader />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          <LeftSection
            familyTree={activeTree}
            familyMembers={familyMembers}
            relationships={relationships}
            loading={loading}
            onCreateTree={handleCreateTree}
            user={user}
          />
          <RightSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
