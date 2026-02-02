/**
 * IMPLEMENTATION EXAMPLE: Phase 1 Tree Visualization
 * 
 * This example demonstrates how the tree visualization works
 * with real data from the MongoDB database.
 */

import { buildHierarchy, calculateLayout, flattenTree } from '@/components/family-tree/useTreeLayout';
import { FamilyMember, Relationship } from '@/components/hooks/useFamilyTree';

// EXAMPLE 1: Simple 3-generation family tree
// ============================================

const exampleMembers: FamilyMember[] = [
  {
    id: 'john-1920',
    first_name: 'John',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '1920-01-15',
    is_root: true, // ROOT PERSON
  },
  {
    id: 'mary-1925',
    first_name: 'Mary',
    last_name: 'Smith',
    gender: 'female',
    birth_date: '1925-06-20',
  },
  {
    id: 'robert-1950',
    first_name: 'Robert',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '1950-03-10',
  },
  {
    id: 'elizabeth-1952',
    first_name: 'Elizabeth',
    last_name: 'Smith',
    gender: 'female',
    birth_date: '1952-07-25',
  },
  {
    id: 'susan-1949',
    first_name: 'Susan',
    last_name: 'Johnson',
    gender: 'female',
    birth_date: '1949-11-30',
  },
  {
    id: 'james-1980',
    first_name: 'James',
    last_name: 'Smith',
    gender: 'male',
    birth_date: '1980-05-12',
  },
  {
    id: 'alice-1985',
    first_name: 'Alice',
    last_name: 'Smith',
    gender: 'female',
    birth_date: '1985-09-08',
  },
];

const exampleRelationships: Relationship[] = [
  // John & Mary marriage
  { id: 'rel-1', person1_id: 'john-1920', person2_id: 'mary-1925', relationship_type: 'spouse' },

  // John & Mary's children
  { id: 'rel-2', person1_id: 'john-1920', person2_id: 'robert-1950', relationship_type: 'parent_child' },
  { id: 'rel-3', person1_id: 'john-1920', person2_id: 'elizabeth-1952', relationship_type: 'parent_child' },

  // Robert's spouse
  { id: 'rel-4', person1_id: 'robert-1950', person2_id: 'susan-1949', relationship_type: 'spouse' },

  // Robert & Susan's children
  { id: 'rel-5', person1_id: 'robert-1950', person2_id: 'james-1980', relationship_type: 'parent_child' },
  { id: 'rel-6', person1_id: 'robert-1950', person2_id: 'alice-1985', relationship_type: 'parent_child' },
];

// STEP 1: Build hierarchy
// =======================
const { root, error } = buildHierarchy(exampleMembers, exampleRelationships);

if (error) {
  console.error('❌ Error building hierarchy:', error);
} else {
  console.log('✅ Hierarchy built successfully!');
  console.log('Root person:', root?.member.first_name, root?.member.last_name);
  console.log('Root has spouse:', !!root?.spouse);
  console.log('Root has', root?.children.length, 'children');
}

// STEP 2: Calculate layout positions
// ===================================
const layoutRoot = calculateLayout(root);

console.log('\n📍 Layout Positions:');
if (layoutRoot) {
  flattenTree(layoutRoot).forEach((node) => {
    console.log(
      `${node.member.first_name}: x=${node.x.toFixed(0)}, y=${node.y.toFixed(0)}`
    );
  });
}

// STEP 3: Use in React component
// ==============================

/**
 * Example React hook usage:
 * 
 * const { familyMembers, relationships } = useFamilyTree(treeId);
 * 
 * <TreeCanvas
 *   familyMembers={familyMembers}
 *   relationships={relationships}
 *   selectedMember={selectedMember}
 *   onSelectMember={handleSelect}
 *   onAddMember={handleAddMember}
 * />
 */

// EXPECTED OUTPUT:
// ================
/*
✅ Hierarchy built successfully!
Root person: John Smith
Root has spouse: true
Root has 2 children

📍 Layout Positions:
John: x=330, y=100
Robert: x=100, y=280
Elizabeth: x=560, y=280
James: x=0, y=460
Alice: x=200, y=460

TREE STRUCTURE:
================
John Smith (b. 1920) m. Mary Smith (b. 1925)
  ├── Robert Smith (b. 1950) m. Susan Johnson (b. 1949)
  │   ├── James Smith (b. 1980)
  │   └── Alice Smith (b. 1985)
  └── Elizabeth Smith (b. 1952)
*/

// PHASE 1 CONSTRAINTS VALIDATION
// ==============================

/**
 * Phase 1 enforces these rules:
 * 
 * ✅ ALLOWED:
 * - Exactly one root person
 * - One spouse per person
 * - Multiple children per parent
 * - Hierarchical structure (one generation at a time)
 * 
 * ❌ NOT ALLOWED:
 * - Multiple spouses (Phase 1 violation)
 * - Divorce/remarriage
 * - Adoption
 * - Step-families
 * - Multiple parents
 * 
 * If you try to add multiple spouses, the validation will show:
 * "Phase 1 violation: John has multiple spouses"
 */

// EXAMPLE: Multiple root persons (INVALID)
const invalidMembers = [
  { ...exampleMembers[0] }, // John (is_root: true)
  { ...exampleMembers[1], is_root: true }, // Mary (is_root: true) - CONFLICT!
];

const { root: invalidRoot, error: invalidError } = buildHierarchy(
  invalidMembers,
  []
);

console.log('\n⚠️  Invalid structure test:');
console.log('Root found:', invalidRoot?.member.first_name);
// Output: Root found: John (only finds first root)

export {
  exampleMembers,
  exampleRelationships,
  buildHierarchy,
  calculateLayout,
  flattenTree,
};
