# Tree Layout Algorithm - Technical Deep Dive

## 🎯 Objective

Generate deterministic, non-overlapping hierarchical layouts for family trees where:
- Parents are centered above their children
- Siblings are sorted by birth date
- All nodes are evenly spaced

## 📐 Algorithm Phases

### Phase 1: Hierarchy Building

**Input:** Flat lists of members and relationships  
**Output:** Hierarchical tree structure in memory

```typescript
type TreeNode = {
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
```

**Steps:**

1. **Find Root Person**
   ```typescript
   const root = members.find(m => m.is_root === true);
   if (!root) throw Error("No root person found");
   ```

2. **Build Maps**
   ```typescript
   // spouse_map[person_id] = spouse_id
   const spouseMap = new Map<string, string>();
   
   // children_map[parent_id] = [child_id1, child_id2, ...]
   const childrenMap = new Map<string, string[]>();
   
   relationships.forEach(rel => {
     if (rel.relationship_type === 'spouse') {
       spouseMap.set(rel.person1_id, rel.person2_id);
       spouseMap.set(rel.person2_id, rel.person1_id);
     } else if (rel.relationship_type === 'parent_child') {
       childrenMap.get(rel.person1_id)?.push(rel.person2_id);
     }
   });
   ```

3. **Sort Children by Birth Date**
   ```typescript
   childrenMap.forEach(childIds => {
     childIds.sort((a, b) => {
       const dateA = memberMap.get(a).birth_date || '';
       const dateB = memberMap.get(b).birth_date || '';
       return dateA.localeCompare(dateB); // ascending (oldest first)
     });
   });
   ```

4. **Recursive Tree Building**
   ```typescript
   function buildNode(memberId: string, level: number): TreeNode {
     const member = memberMap.get(memberId);
     const spouse = spouseMap.get(memberId);
     const childIds = childrenMap.get(memberId) || [];
     
     const children = childIds
       .map(childId => buildNode(childId, level + 1));
     
     return {
       id: memberId,
       member,
       spouse,
       children,
       level,
       x: 0, y: 0, // to be calculated in Phase 2
       width: CONFIG.nodeWidth,
       height: CONFIG.nodeHeight,
     };
   }
   
   const root = buildNode(rootId, 0);
   ```

---

### Phase 2: Width Calculation

**Purpose:** Calculate how wide each subtree is to position parents correctly

**Algorithm:** Post-order traversal (children before parent)

```typescript
function calculateSubtreeWidth(node: TreeNode): number {
  // Base case: leaf node (no children)
  if (node.children.length === 0) {
    return node.width; // e.g., 140px
  }
  
  // Recursive case: sum of children + gaps
  const childrenWidth = node.children.reduce((sum, child) => {
    return sum + calculateSubtreeWidth(child) + CONFIG.horizontalGap;
  }, 0);
  
  // Remove last gap
  return childrenWidth - CONFIG.horizontalGap;
}
```

**Example Calculation:**
```
        Parent
        /    \
    Child1   Child2
    
Child1 subtree width = 140
Child2 subtree width = 140
Parent subtree width = 140 + 180 + 140 - 180 = 280
                      (c1 + gap + c2 - gap)
```

---

### Phase 3: Position Assignment

**Purpose:** Place each node at its calculated (x, y) coordinates

**Algorithm:** Post-order traversal with side-to-side positioning

```typescript
function assignPositions(
  node: TreeNode,
  x: number,      // left edge of this subtree
  y: number       // vertical level
): void {
  node.y = y; // All nodes at same level get same y
  
  if (node.children.length === 0) {
    // Leaf node: place at left edge
    node.x = x;
  } else {
    // Parent node: center above children
    const subtreeWidth = calculateSubtreeWidth(node);
    node.x = x + (subtreeWidth / 2) - (node.width / 2);
    
    // Position children left-to-right
    let childX = x;
    node.children.forEach(child => {
      const childSubtreeWidth = calculateSubtreeWidth(child);
      assignPositions(child, childX, y + CONFIG.verticalGap);
      childX += childSubtreeWidth + CONFIG.horizontalGap;
    });
  }
}
```

**Key Insight:** Parent is centered by:
```
parent.x = subtree_left_edge + (subtree_width / 2) - (node_width / 2)
```

---

### Phase 4: Viewport Centering

**Purpose:** Center the entire tree within the available viewport

```typescript
function centerInViewport(root: TreeNode, viewportWidth: number): void {
  const treeWidth = calculateSubtreeWidth(root);
  const centerOffset = (viewportWidth - treeWidth) / 2;
  
  // Shift all nodes by center offset
  function shiftX(node: TreeNode, offset: number): void {
    node.x += offset;
    node.children.forEach(child => shiftX(child, offset));
  }
  
  shiftX(root, centerOffset);
}
```

---

## 📊 Visual Example

### Input Data
```
Members:
- John (b. 1950, root=true)
- Mary (b. 1952)
- Alice (b. 1980)
- Bob (b. 1978)

Relationships:
- John ↔ Mary (spouse)
- John → Alice (parent)
- John → Bob (parent)
```

### Step 1: Build Hierarchy
```
{
  id: 'john',
  member: { first_name: 'John', ... },
  spouse: { first_name: 'Mary', ... },
  children: [
    { id: 'bob', ... },    // older (1978)
    { id: 'alice', ... }   // younger (1980)
  ],
  level: 0
}
```

### Step 2: Calculate Widths
```
bob.width = 140
alice.width = 140
john.width = 140 + 180 + 140 = 460
            (bob + gap + alice)
```

### Step 3: Assign Positions
```
Assuming viewport 1200px centered:

john.x = (1200 - 460) / 2 = 370
john.x = 370 + (460 / 2) - (140 / 2) = 460
john.y = 100

bob.x = 370
bob.y = 280

alice.x = 370 + 140 + 180 = 690
alice.y = 280

Result:
         John (460, 100)
        /    \
    Bob      Alice
  (370,280) (690,280)
```

---

## ⚙️ Configuration

```typescript
interface LayoutConfig {
  nodeWidth: 140,           // Card width (px)
  nodeHeight: 80,          // Card height (px)
  horizontalGap: 180,      // Sibling spacing (px)
  verticalGap: 180,        // Generation spacing (px)
  pairGap: 20,            // Person-spouse gap (px)
}
```

**Spacing Formula:**
- Min spacing between siblings: `horizontalGap = 180px`
- Min spacing between generations: `verticalGap = 180px`

Adjust these values to match your design:
```typescript
// Compact layout
const compactConfig = {
  nodeWidth: 120,
  nodeHeight: 70,
  horizontalGap: 140,
  verticalGap: 140,
};

// Spacious layout
const spaciousConfig = {
  nodeWidth: 160,
  nodeHeight: 90,
  horizontalGap: 200,
  verticalGap: 200,
};
```

---

## 🔍 Time Complexity

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| `buildHierarchy()` | O(n + m) | n=members, m=relationships |
| `calculateSubtreeWidth()` | O(n) | Single post-order pass |
| `assignPositions()` | O(n) | Single pre-order pass |
| `calculateLayout()` | O(n) | Calls width calc + position assign |
| **Total** | **O(n + m)** | Linear in tree size |

Memory: O(n) for tree structure

---

## 🧪 Test Cases

### Test 1: Single Person (Root Only)
```
Input:
- John (is_root=true)
- No relationships

Expected:
- john.x = (viewport - 140) / 2 ≈ 530
- john.y = 100
- john.children = []
```

### Test 2: Root + Spouse (No Children)
```
Input:
- John (is_root=true)
- Mary
- John ↔ Mary (spouse)

Expected:
- john.x = center
- john.y = 100
- mary displayed beside john
- mary.children = []
```

### Test 3: Three Generations
```
Input:
- John (root)
- Mary
- Alice, Bob (children)
- Charlie, Diana (grandchildren of Alice)

Expected:
- John centered above Alice & Bob
- Alice centered above Charlie & Diana
- All at correct levels
- Proper sibling sorting by birth_date
```

### Test 4: Multiple Siblings (Odd Number)
```
Input:
- John (root)
- Alice, Bob, Charlie (children, different birth dates)

Expected:
- Children sorted by birth_date
- John centered above all three
- Even spacing between siblings
```

---

## ✅ Validation Rules

**Phase 1 Constraints:**

1. Exactly one root person
   ```typescript
   const roots = members.filter(m => m.is_root);
   if (roots.length !== 1) throw Error("Need exactly one root");
   ```

2. No multiple spouses
   ```typescript
   const spouseCount = new Map<string, number>();
   relationships.forEach(rel => {
     if (rel.relationship_type === 'spouse') {
       spouseCount.set(rel.person1_id, (spouseCount.get(...) || 0) + 1);
     }
   });
   if (spouseCount.get(personId) > 1) throw Error("Multiple spouses");
   ```

3. All members connected to root
   ```typescript
   const visited = new Set<string>();
   function dfs(nodeId: string) {
     visited.add(nodeId);
     childrenMap.get(nodeId)?.forEach(dfs);
   }
   dfs(root.id);
   if (visited.size !== members.length) throw Error("Disconnected members");
   ```

---

## 🎨 Rendering

Once layout is complete, SVG rendering is straightforward:

```typescript
// For each node, draw:
<rect x={node.x} y={node.y} width={node.width} height={node.height} />

// For each parent-child pair, draw:
<line x1={parent.x + w/2} y1={parent.y + h}
      x2={child.x + w/2} y2={child.y} />
```

Connection lines:
- **Parent-to-child:** Vertical from parent's bottom to child's top
- **Spouse-to-spouse:** Horizontal line connecting pair centers

---

## 📈 Scalability

**Tree Sizes:**
- Small: 10-50 members ✅ (instant)
- Medium: 50-500 members ✅ (< 50ms)
- Large: 500-5000 members ✅ (< 500ms)
- Huge: 5000+ members ⚠️ (may need optimization)

**Optimization Tips:**
1. Virtualize rendering for > 1000 nodes
2. Use WebWorker for layout calculation
3. Implement node caching for unchanged subtrees
4. Progressive rendering (render visible nodes first)

---

## 🔗 Related Algorithms

- **Reingold-Tilford Algorithm**: Similar hierarchical layout (used by many tree visualizers)
- **Sugiyama Framework**: For directed acyclic graphs
- **Circle Packing**: Alternative layout for densely connected graphs

---

**Algorithm Version**: 1.0  
**Phase**: 1 (Single spouse per person)  
**Last Updated**: February 2026
