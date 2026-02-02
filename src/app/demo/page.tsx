'use client';

import { useState } from 'react';
import { TreeVisualization } from '@/components/family-tree/TreeVisualization';
import type { FamilyMember } from '@/components/hooks/useFamilyTree';

// Dummy data for immediate display - 18 people across multiple generations
const dummyFamilyMembers: FamilyMember[] = [
  // Generation 1 (Root)
  {

    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '1945-03-15',
    is_root: true,
  },
  {
    id: '2',
    first_name: 'Mary',
    last_name: 'Johnson',
    gender: 'female',
    birth_date: '1948-07-22',
    is_root: false,
  },

  // Generation 2 (Children of John & Mary)
  {
    id: '3',
    first_name: 'Robert',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '1970-11-08',
    is_root: false,
  },
  {
    id: '4',
    first_name: 'Patricia',
    last_name: 'Smith',
    gender: 'female',
    birth_date: '1972-04-14',
    is_root: false,
  },
  {
    id: '5',
    first_name: 'Michael',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '1975-09-20',
    is_root: false,
  },

  // Generation 2 Spouses
  {
    id: '6',
    first_name: 'Sarah',
    last_name: 'Williams',
    gender: 'female',
    birth_date: '1972-06-10',
    is_root: false,
  },
  {
    id: '7',
    first_name: 'David',
    last_name: 'Brown',
    gender: 'male',
    birth_date: '1970-02-28',
    is_root: false,
  },
  {
    id: '8',
    first_name: 'Jennifer',
    last_name: 'Davis',
    gender: 'female',
    birth_date: '1976-12-03',
    is_root: false,
  },

  // Patricia's parents (David Brown's parents - added for extended family)
  {
    id: '19',
    first_name: 'George',
    last_name: 'Brown',
    gender: 'male',
    birth_date: '1940-08-20',
    is_root: false,
  },
  {
    id: '20',
    first_name: 'Elizabeth',
    last_name: 'Taylor',
    gender: 'female',
    birth_date: '1943-05-12',
    is_root: false,
  },

  // Generation 3 (Grandchildren - Robert & Sarah's children)
  {
    id: '9',
    first_name: 'James',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '2000-09-20',
    is_root: false,
  },
  {
    id: '10',
    first_name: 'Emma',
    last_name: 'Smith',
    gender: 'female',
    birth_date: '2003-12-03',
    is_root: false,
  },

  // Generation 3 (Patricia & David's children)
  {
    id: '11',
    first_name: 'William',
    last_name: 'Brown',
    gender: 'male',
    birth_date: '2001-05-15',
    is_root: false,
  },
  {
    id: '12',
    first_name: 'Olivia',
    last_name: 'Brown',
    gender: 'female',
    birth_date: '2004-08-22',
    is_root: false,
  },
  {
    id: '13',
    first_name: 'Sophia',
    last_name: 'Brown',
    gender: 'female',
    birth_date: '2006-11-10',
    is_root: false,
  },

  // Generation 3 (Michael & Jennifer's children)
  {
    id: '14',
    first_name: 'Daniel',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '2002-03-18',
    is_root: false,
  },
  {
    id: '15',
    first_name: 'Ava',
    last_name: 'Smith',
    gender: 'female',
    birth_date: '2005-07-09',
    is_root: false,
  },

  // James Smith's spouse
  {
    id: '21',
    first_name: 'Lisa',
    last_name: 'Wilson',
    gender: 'female',
    birth_date: '2002-04-17',
    is_root: false,
  },

  // Lisa Wilson's family - Parents
  {
    id: '22',
    first_name: 'Thomas',
    last_name: 'Wilson',
    gender: 'male',
    birth_date: '1968-10-05',
    is_root: false,
  },
  {
    id: '23',
    first_name: 'Catherine',
    last_name: 'White',
    gender: 'female',
    birth_date: '1970-02-18',
    is_root: false,
  },

  // Lisa Wilson's family - Grandparents (paternal)
  {
    id: '24',
    first_name: 'Edward',
    last_name: 'Wilson',
    gender: 'male',
    birth_date: '1940-12-15',
    is_root: false,
  },
  {
    id: '25',
    first_name: 'Rose',
    last_name: 'Kelly',
    gender: 'female',
    birth_date: '1943-06-22',
    is_root: false,
  },

  // Lisa Wilson's brother
  {
    id: '26',
    first_name: 'Kevin',
    last_name: 'Wilson',
    gender: 'male',
    birth_date: '2000-07-09',
    is_root: false,
  },

  // Lisa's brother's wife
  {
    id: '27',
    first_name: 'Amanda',
    last_name: 'Harris',
    gender: 'female',
    birth_date: '2001-11-30',
    is_root: false,
  },

  // Lisa's brother's children
  {
    id: '28',
    first_name: 'Noah',
    last_name: 'Wilson',
    gender: 'male',
    birth_date: '2022-03-14',
    is_root: false,
  },
  {
    id: '29',
    first_name: 'Sophie',
    last_name: 'Wilson',
    gender: 'female',
    birth_date: '2023-09-27',
    is_root: false,
  },

  // Generation 4 (Great-grandchildren)
  {
    id: '16',
    first_name: 'Lucas',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '2020-01-14',
    is_root: false,
  },
  {
    id: '17',
    first_name: 'Isabella',
    last_name: 'Smith',
    gender: 'female',
    birth_date: '2022-06-21',
    is_root: false,
  },
  {
    id: '18',
    first_name: 'Henry',
    last_name: 'Brown',
    gender: 'male',
    birth_date: '2021-09-08',
    is_root: false,
  },
];

const dummyRelationships: any[] = [
  // John & Mary marriage
  { id: 'rel1', person1_id: '1', person2_id: '2', relationship_type: 'spouse' },
  
  // John & Mary's children
  { id: 'rel2', person1_id: '1', person2_id: '3', relationship_type: 'parent_child' },
  { id: 'rel3', person1_id: '2', person2_id: '3', relationship_type: 'parent_child' },
  { id: 'rel4', person1_id: '1', person2_id: '4', relationship_type: 'parent_child' },
  { id: 'rel5', person1_id: '2', person2_id: '4', relationship_type: 'parent_child' },
  { id: 'rel6', person1_id: '1', person2_id: '5', relationship_type: 'parent_child' },
  { id: 'rel7', person1_id: '2', person2_id: '5', relationship_type: 'parent_child' },

  // Robert & Sarah marriage
  { id: 'rel8', person1_id: '3', person2_id: '6', relationship_type: 'spouse' },
  // Robert & Sarah's children
  { id: 'rel9', person1_id: '3', person2_id: '9', relationship_type: 'parent_child' },
  { id: 'rel10', person1_id: '6', person2_id: '9', relationship_type: 'parent_child' },
  { id: 'rel11', person1_id: '3', person2_id: '10', relationship_type: 'parent_child' },
  { id: 'rel12', person1_id: '6', person2_id: '10', relationship_type: 'parent_child' },

  // Patricia & David marriage
  { id: 'rel13', person1_id: '4', person2_id: '7', relationship_type: 'spouse' },
  // Patricia & David's children
  { id: 'rel14', person1_id: '4', person2_id: '11', relationship_type: 'parent_child' },
  { id: 'rel15', person1_id: '7', person2_id: '11', relationship_type: 'parent_child' },
  { id: 'rel16', person1_id: '4', person2_id: '12', relationship_type: 'parent_child' },
  { id: 'rel17', person1_id: '7', person2_id: '12', relationship_type: 'parent_child' },
  { id: 'rel18', person1_id: '4', person2_id: '13', relationship_type: 'parent_child' },
  { id: 'rel19', person1_id: '7', person2_id: '13', relationship_type: 'parent_child' },

  // Michael & Jennifer marriage
  { id: 'rel20', person1_id: '5', person2_id: '8', relationship_type: 'spouse' },
  // Michael & Jennifer's children
  { id: 'rel21', person1_id: '5', person2_id: '14', relationship_type: 'parent_child' },
  { id: 'rel22', person1_id: '8', person2_id: '14', relationship_type: 'parent_child' },
  { id: 'rel23', person1_id: '5', person2_id: '15', relationship_type: 'parent_child' },
  { id: 'rel24', person1_id: '8', person2_id: '15', relationship_type: 'parent_child' },

  // James & Lisa marriage
  { id: 'rel25', person1_id: '9', person2_id: '21', relationship_type: 'spouse' },
  // James & Lisa's children (Lucas & Isabella)
  { id: 'rel26', person1_id: '9', person2_id: '16', relationship_type: 'parent_child' },
  { id: 'rel27', person1_id: '21', person2_id: '16', relationship_type: 'parent_child' },
  { id: 'rel28', person1_id: '9', person2_id: '17', relationship_type: 'parent_child' },
  { id: 'rel29', person1_id: '21', person2_id: '17', relationship_type: 'parent_child' },

  // William's children (Generation 4)
  { id: 'rel30', person1_id: '11', person2_id: '18', relationship_type: 'parent_child' },

  // David Brown's parents (Generation 0 - extended family)
  { id: 'rel31', person1_id: '19', person2_id: '20', relationship_type: 'spouse' },
  // David is child of George & Elizabeth
  { id: 'rel32', person1_id: '19', person2_id: '7', relationship_type: 'parent_child' },
  { id: 'rel33', person1_id: '20', person2_id: '7', relationship_type: 'parent_child' },

  // Lisa Wilson's grandparents marriage
  { id: 'rel34', person1_id: '24', person2_id: '25', relationship_type: 'spouse' },
  // Thomas Wilson (Lisa's father) is child of Edward & Rose
  { id: 'rel35', person1_id: '24', person2_id: '22', relationship_type: 'parent_child' },
  { id: 'rel36', person1_id: '25', person2_id: '22', relationship_type: 'parent_child' },

  // Lisa Wilson's parents marriage
  { id: 'rel37', person1_id: '22', person2_id: '23', relationship_type: 'spouse' },
  // Lisa is daughter of Thomas & Catherine
  { id: 'rel38', person1_id: '22', person2_id: '21', relationship_type: 'parent_child' },
  { id: 'rel39', person1_id: '23', person2_id: '21', relationship_type: 'parent_child' },
  // Kevin is son of Thomas & Catherine
  { id: 'rel40', person1_id: '22', person2_id: '26', relationship_type: 'parent_child' },
  { id: 'rel41', person1_id: '23', person2_id: '26', relationship_type: 'parent_child' },

  // Kevin Wilson's marriage
  { id: 'rel42', person1_id: '26', person2_id: '27', relationship_type: 'spouse' },
  // Noah is son of Kevin & Amanda
  { id: 'rel43', person1_id: '26', person2_id: '28', relationship_type: 'parent_child' },
  { id: 'rel44', person1_id: '27', person2_id: '28', relationship_type: 'parent_child' },
  // Sophie is daughter of Kevin & Amanda
  { id: 'rel45', person1_id: '26', person2_id: '29', relationship_type: 'parent_child' },
  { id: 'rel46', person1_id: '27', person2_id: '29', relationship_type: 'parent_child' },
];

/**
 * Demo page showcasing the MyHeritage-style Family Tree Component
 * 
 * This demonstrates:
 * - Loading example family data
 * - Rendering an interactive 3-generation family tree
 * - Handling member selection
 * - Side panel with detailed member information
 * 
 * Features demonstrated:
 * ✓ Circular profile images
 * ✓ Gender-based styling (subtle indicators)
 * ✓ Root person highlighting (gold border)
 * ✓ Smooth zoom and pan
 * ✓ Click to view details
 * ✓ Responsive design
 * ✓ Loading states
 * ✓ Empty states
 */
export default function FamilyTreeDemo() {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const handleAddMember = (relationType?: 'parent' | 'spouse' | 'child', relatedTo?: FamilyMember) => {
    console.log('Add new member:', {
      relationType,
      relatedTo: relatedTo ? `${relatedTo.first_name} ${relatedTo.last_name}` : 'root',
    });
    
    // TODO: Implement your add member logic here
    // Example: Open a modal/dialog to collect new member information
    // Then update your family members and relationships arrays
    alert(`Add ${relationType || 'new member'} ${relatedTo ? 'related to ' + relatedTo.first_name : ''}`);
  };

  return (
    <div className="w-full h-screen bg-white">
      {/* Optional: Add a header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smith Family Tree</h1>
            <p className="text-sm text-gray-600">4 generations • {dummyFamilyMembers.length} members</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span>Male</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-pink-400"></div>
              <span>Female</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border-2 border-amber-500"></div>
              <span>Root Person</span>
            </div>
          </div>
        </div>
      </div>

      {/* Family Tree Component */}
      <div className="w-full h-full pt-20">
        <TreeVisualization
          familyMembers={dummyFamilyMembers}
          relationships={dummyRelationships}
          selectedMember={selectedMember}
          onSelectMember={setSelectedMember}
          onAddMember={handleAddMember}
        />
      </div>

      {/* Optional: Instructions overlay (can be removed) */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm hidden lg:block">
        <h3 className="font-semibold text-gray-900 mb-2">Quick Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <span className="font-medium">Click</span> any person to view details</li>
          <li>• <span className="font-medium">Scroll</span> to zoom in/out</li>
          <li>• <span className="font-medium">Drag</span> the canvas to pan around</li>
          <li>• Tree auto-centers on load</li>
        </ul>
      </div>
    </div>
  );
}
