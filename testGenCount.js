
// Mock logic from treeUtils.ts
const calculateGenerations = (members, relationships) => {
  if (members.length === 0) return 0;
  if (relationships.length === 0) return 1;

  const parentsMap = new Map();
  const childrenMap = new Map();

  // Build graph
  relationships.forEach(rel => {
    if (rel.relationship_type === 'parent_child') {
      if (!childrenMap.has(rel.person1_id)) childrenMap.set(rel.person1_id, []);
      childrenMap.get(rel.person1_id).push(rel.person2_id);

      if (!parentsMap.has(rel.person2_id)) parentsMap.set(rel.person2_id, []);
      parentsMap.get(rel.person2_id).push(rel.person1_id);
    }
  });

  const roots = [];
  members.forEach(m => {
    const p = parentsMap.get(m.id);
    if (!p || p.length === 0) {
      roots.push(m.id);
    }
  });

  console.log("Roots identified:", roots);

  let maxGenerations = 1;

  const getDepth = (id, depth) => {
    if (depth > maxGenerations) {
      maxGenerations = depth;
    }

    const children = childrenMap.get(id);
    if (children) {
      children.forEach(childId => {
        getDepth(childId, depth + 1);
      });
    }
  };

  roots.forEach(rootId => {
    getDepth(rootId, 1);
  });

  return maxGenerations;
};

// Test Case: 4 Generations
// Grandparent (1) -> Parent (2) -> Self (3) -> Child (4)
const members = [
  { id: '1' }, // GP
  { id: '2' }, // P
  { id: '3' }, // Me
  { id: '4' }  // C
];

const relationships = [
  { person1_id: '1', person2_id: '2', relationship_type: 'parent_child' },
  { person1_id: '2', person2_id: '3', relationship_type: 'parent_child' },
  { person1_id: '3', person2_id: '4', relationship_type: 'parent_child' }
];

console.log("Testing 4 generations chain...");
const result = calculateGenerations(members, relationships);
console.log("Result:", result);

if (result === 4) {
  console.log("SUCCESS: Correctly calculated 4 generations.");
} else {
  console.error(`FAILURE: Expected 4 but got ${result}`);
}

// Test Case: Disconnected
const members2 = [{ id: 'A' }, { id: 'B' }];
const rels2 = [];
console.log("\nTesting disconnected...");
const res2 = calculateGenerations(members2, rels2);
console.log("Result:", res2); // Should be 1
