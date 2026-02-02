import { FamilyMember, Relationship } from '@/components/hooks/useFamilyTree';

export interface TreeNode {
  id: string;
  member: FamilyMember;
  spouse: FamilyMember | null;
  children: TreeNode[];
  level: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalGap: number;
  verticalGap: number;
  pairGap: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
  nodeWidth: 140,
  nodeHeight: 80,
  horizontalGap: 180,
  verticalGap: 180,
  pairGap: 20,
};

/**
 * Build deterministic hierarchy from flat member list
 * Phase 1 Rules:
 * - Single root person (is_root === true)
 * - One spouse per person (no multiple spouses)
 * - Children grouped by parent pair
 * - Children sorted by birth_date ascending (oldest left)
 */
export const buildHierarchy = (
  members: FamilyMember[],
  relationships: Relationship[],
  config: LayoutConfig = DEFAULT_CONFIG
): { root: TreeNode | null; error: string | null } => {
  // Validate data
  if (!members || members.length === 0) {
    return { root: null, error: 'No members found' };
  }

  // Find root person
  const rootMember = members.find((m) => m.is_root);
  if (!rootMember) {
    return { root: null, error: 'No root person found (is_root must be set for one member)' };
  }

  // Create member map for O(1) lookups
  const memberMap = new Map(members.map((m) => [m.id, m]));

  // Build relationship maps
  const spouseMap = new Map<string, string>();
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();

  relationships.forEach((rel) => {
    if (rel.relationship_type === 'spouse') {
      // Enforce Phase 1: no multiple spouses
      if (spouseMap.has(rel.person1_id) || spouseMap.has(rel.person2_id)) {
        console.warn(`Multiple spouses detected for ${rel.person1_id} or ${rel.person2_id} - Phase 1 violation`);
      }
      spouseMap.set(rel.person1_id, rel.person2_id);
      spouseMap.set(rel.person2_id, rel.person1_id);
    } else if (rel.relationship_type === 'parent_child') {
      // Build parent-child relationships
      if (!childrenMap.has(rel.person1_id)) {
        childrenMap.set(rel.person1_id, []);
      }
      childrenMap.get(rel.person1_id)!.push(rel.person2_id);
      parentMap.set(rel.person2_id, rel.person1_id);
    }
  });

  // Sort children by birth_date (oldest first = ascending)
  childrenMap.forEach((childIds) => {
    childIds.sort((a, b) => {
      const dateA = memberMap.get(a)?.birth_date || '';
      const dateB = memberMap.get(b)?.birth_date || '';
      return dateA.localeCompare(dateB);
    });
  });

  // Recursive function to build tree structure
  const buildNode = (memberId: string, level: number): TreeNode => {
    const member = memberMap.get(memberId)!;
    const spouseId = spouseMap.get(memberId);
    const spouse = spouseId ? (memberMap.get(spouseId) || null) : null;
    const childIds = childrenMap.get(memberId) || [];

    const children = childIds
      .filter((childId) => memberMap.has(childId))
      .map((childId) => buildNode(childId, level + 1));

    const node: TreeNode = {
      id: memberId,
      member,
      spouse,
      children,
      level,
      x: 0,
      y: 0,
      width: config.nodeWidth,
      height: config.nodeHeight,
    };

    return node;
  };

  const root = buildNode(rootMember.id, 0);
  return { root, error: null };
};

/**
 * Calculate layout positions for tree nodes
 * Algorithm:
 * 1. Calculate width of each subtree (sum of children + spacing)
 * 2. Position parent at midpoint of children
 * 3. Assign Y position based on level
 */
export const calculateLayout = (
  root: TreeNode | null,
  config: LayoutConfig = DEFAULT_CONFIG,
  viewportWidth: number = 1200
): TreeNode | null => {
  if (!root) return null;

  // Recursive calculation of subtree width
  const calculateSubtreeWidth = (node: TreeNode): number => {
    if (node.children.length === 0) {
      return config.nodeWidth;
    }

    const childrenWidth = node.children.reduce(
      (sum, child) => sum + calculateSubtreeWidth(child) + config.horizontalGap,
      0
    );
    return Math.max(childrenWidth - config.horizontalGap, config.nodeWidth);
  };

  // Recursive position assignment
  const assignPositions = (node: TreeNode, x: number, y: number): void => {
    node.y = y;

    if (node.children.length === 0) {
      node.x = x;
    } else {
      // Center parent above children
      const subtreeWidth = calculateSubtreeWidth(node);
      node.x = x + subtreeWidth / 2 - config.nodeWidth / 2;

      // Position children
      let childX = x;
      node.children.forEach((child) => {
        const childWidth = calculateSubtreeWidth(child);
        assignPositions(child, childX, y + config.verticalGap);
        childX += childWidth + config.horizontalGap;
      });
    }
  };

  // Start positioning from root (centered)
  const treeWidth = calculateSubtreeWidth(root);
  const startX = Math.max(0, (viewportWidth - treeWidth) / 2);
  assignPositions(root, startX, 100);

  return root;
};

/**
 * Get all nodes in tree (flattened)
 */
export const flattenTree = (root: TreeNode | null): TreeNode[] => {
  if (!root) return [];

  const nodes: TreeNode[] = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    nodes.push(node);
    queue.push(...node.children);
  }

  return nodes;
};

/**
 * Validate tree structure (Phase 1 rules)
 */
export const validateTreeStructure = (
  root: TreeNode | null,
  members: FamilyMember[],
  relationships: Relationship[]
): string[] => {
  const errors: string[] = [];

  if (!root) {
    errors.push('No root node');
    return errors;
  }

  // Check for multiple spouses
  const spouseCount = new Map<string, number>();
  relationships.forEach((rel) => {
    if (rel.relationship_type === 'spouse') {
      spouseCount.set(rel.person1_id, (spouseCount.get(rel.person1_id) || 0) + 1);
      spouseCount.set(rel.person2_id, (spouseCount.get(rel.person2_id) || 0) + 1);
    }
  });

  spouseCount.forEach((count, personId) => {
    if (count > 1) {
      const member = members.find((m) => m.id === personId);
      errors.push(
        `Phase 1 violation: ${member?.first_name} has multiple spouses`
      );
    }
  });

  // Validate all members are in tree
  const nodesSet = new Set(flattenTree(root).map((n) => n.id));
  members.forEach((member) => {
    if (!nodesSet.has(member.id)) {
      errors.push(
        `Member ${member.first_name} ${member.last_name} is not connected to root`
      );
    }
  });

  return errors;
};

export const useTreeLayout = () => {
  return {
    buildHierarchy,
    calculateLayout,
    flattenTree,
    validateTreeStructure,
  };
};
