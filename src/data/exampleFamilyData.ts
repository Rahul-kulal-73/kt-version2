// Example data for MyHeritage-style Family Tree Component
// This demonstrates how to structure your family data for the Balkan FamilyTree.js component

export const exampleFamilyMembers = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '1950-03-15',
    birth_place: 'New York, NY',
    occupation: 'Engineer',
    profile_image: 'https://i.pravatar.cc/150?img=12',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@example.com',
    biography: 'John Smith was born in New York and dedicated his life to engineering innovation.',
    is_root: true, // This marks the root person of the tree
  },
  {
    id: '2',
    first_name: 'Mary',
    last_name: 'Johnson',
    gender: 'female',
    birth_date: '1952-07-22',
    birth_place: 'Boston, MA',
    occupation: 'Teacher',
    profile_image: 'https://i.pravatar.cc/150?img=45',
    phone: '+1 (555) 987-6543',
    email: 'mary.johnson@example.com',
    is_root: false,
  },
  {
    id: '3',
    first_name: 'Robert',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '1975-11-08',
    birth_place: 'Chicago, IL',
    occupation: 'Software Developer',
    profile_image: 'https://i.pravatar.cc/150?img=33',
    email: 'robert.smith@example.com',
    is_root: false,
  },
  {
    id: '4',
    first_name: 'Sarah',
    last_name: 'Williams',
    gender: 'female',
    birth_date: '1978-04-14',
    birth_place: 'Seattle, WA',
    occupation: 'Designer',
    profile_image: 'https://i.pravatar.cc/150?img=27',
    is_root: false,
  },
  {
    id: '5',
    first_name: 'James',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '2005-09-20',
    birth_place: 'San Francisco, CA',
    profile_image: 'https://i.pravatar.cc/150?img=51',
    is_root: false,
  },
  {
    id: '6',
    first_name: 'Emma',
    last_name: 'Smith',
    gender: 'female',
    birth_date: '2008-12-03',
    birth_place: 'San Francisco, CA',
    profile_image: 'https://i.pravatar.cc/150?img=44',
    is_root: false,
  },
];

export const exampleRelationships = [
  // Spousal relationship
  {
    id: 'rel1',
    person1_id: '1', // John
    person2_id: '2', // Mary
    relationship_type: 'spouse',
  },
  // Parent-child relationships
  {
    id: 'rel2',
    person1_id: '1', // John (father)
    person2_id: '3', // Robert (son)
    relationship_type: 'parent_child',
  },
  {
    id: 'rel3',
    person1_id: '2', // Mary (mother)
    person2_id: '3', // Robert (son)
    relationship_type: 'parent_child',
  },
  // Second generation marriage
  {
    id: 'rel4',
    person1_id: '3', // Robert
    person2_id: '4', // Sarah
    relationship_type: 'spouse',
  },
  // Third generation
  {
    id: 'rel5',
    person1_id: '3', // Robert (father)
    person2_id: '5', // James (son)
    relationship_type: 'parent_child',
  },
  {
    id: 'rel6',
    person1_id: '4', // Sarah (mother)
    person2_id: '5', // James (son)
    relationship_type: 'parent_child',
  },
  {
    id: 'rel7',
    person1_id: '3', // Robert (father)
    person2_id: '6', // Emma (daughter)
    relationship_type: 'parent_child',
  },
  {
    id: 'rel8',
    person1_id: '4', // Sarah (mother)
    person2_id: '6', // Emma (daughter)
    relationship_type: 'parent_child',
  },
];

/**
 * Usage Example:
 * 
 * import { TreeVisualization } from '@/components/family-tree/TreeVisualization';
 * import { exampleFamilyMembers, exampleRelationships } from '@/data/exampleFamilyData';
 * 
 * function MyFamilyTreePage() {
 *   const [selectedMember, setSelectedMember] = useState(null);
 * 
 *   return (
 *     <TreeVisualization
 *       familyMembers={exampleFamilyMembers}
 *       relationships={exampleRelationships}
 *       selectedMember={selectedMember}
 *       onSelectMember={setSelectedMember}
 *       onAddMember={(relationType, relatedTo) => {
 *         console.log('Add member:', relationType, relatedTo);
 *       }}
 *     />
 *   );
 * }
 */
