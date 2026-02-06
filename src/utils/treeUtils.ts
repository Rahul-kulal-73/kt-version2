
export interface SimpleMember {
  id: string;
}

export interface SimpleRelationship {
  person1_id: string;
  person2_id: string;
  relationship_type: string;
}

export const calculateGenerations = (members: SimpleMember[], relationships: SimpleRelationship[]): number => {
  if (members.length === 0) return 0;
  if (relationships.length === 0) return 1;

  const parentsMap = new Map<string, string[]>();
  const childrenMap = new Map<string, string[]>();

  // Build graph
  relationships.forEach(rel => {
    if (rel.relationship_type === 'parent_child') {
      // person1 is parent, person2 is child
      if (!childrenMap.has(rel.person1_id)) childrenMap.set(rel.person1_id, []);
      childrenMap.get(rel.person1_id)!.push(rel.person2_id);

      if (!parentsMap.has(rel.person2_id)) parentsMap.set(rel.person2_id, []);
      parentsMap.get(rel.person2_id)!.push(rel.person1_id);
    }
  });

  // 1. Find all "root" nodes (nodes with NO parents in the dataset)
  // Note: Spouses might not be connected via parent-child, so we treat everyone with no recorded parents as a potential root for a lineage.
  const roots: string[] = [];
  members.forEach(m => {
      const p = parentsMap.get(m.id);
      if (!p || p.length === 0) {
          roots.push(m.id);
      }
  });

  // 2. DFS to find max depth from any root
  let maxGenerations = 1;

  const getDepth = (id: string, depth: number, visited: Set<string>) => {
      if (visited.has(id)) return;
      visited.add(id);

      // If depth is greater than current max, update it
      if (depth > maxGenerations) {
          maxGenerations = depth;
      }
      
      const children = childrenMap.get(id);
      if (children) {
          children.forEach(childId => {
              getDepth(childId, depth + 1, new Set(visited));
          });
      }
  };

  roots.forEach(rootId => {
      getDepth(rootId, 1, new Set());
  });

  return maxGenerations;
};
