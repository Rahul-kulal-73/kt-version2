'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { FamilyMember, Relationship } from '@/components/hooks/useFamilyTree';
import { TreeNode as TreeNodeType, buildHierarchy, calculateLayout, flattenTree, validateTreeStructure } from './useTreeLayout';
import { useZoomPan } from './useZoomPan';
import { TreeNode } from './TreeNode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, RotateCcw } from 'lucide-react';

interface TreeCanvasProps {
  familyMembers: FamilyMember[];
  relationships: Relationship[];
  selectedMember: FamilyMember | null;
  onSelectMember: (member: FamilyMember) => void;
  onAddMember?: (relationType: 'parent' | 'spouse' | 'child', relatedTo: FamilyMember) => void;
  treeId?: string;
}

export const TreeCanvas = React.forwardRef<any, TreeCanvasProps>(
  ({
    familyMembers,
    relationships,
    selectedMember,
    onSelectMember,
    onAddMember,
    treeId,
  }, ref) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const { state: zoomPanState, reset: resetZoomPan, fitToBounds } = useZoomPan(svgRef as React.RefObject<SVGSVGElement>);

    // Build and calculate tree layout
    const { root, error: buildError } = useMemo(
      () => buildHierarchy(familyMembers, relationships),
      [familyMembers, relationships]
    );

    const layoutRoot = useMemo(
      () => calculateLayout(root, { nodeWidth: 140, nodeHeight: 80, horizontalGap: 180, verticalGap: 180, pairGap: 20 }, 1400),
      [root]
    );

    const nodes = useMemo(() => flattenTree(layoutRoot), [layoutRoot]);

    const validationErrors = useMemo(
      () => validateTreeStructure(root, familyMembers, relationships),
      [root, familyMembers, relationships]
    );

    // Calculate bounding box for fitToBounds
    useEffect(() => {
      if (nodes.length > 0) {
        const minX = Math.min(...nodes.map((n) => n.x));
        const maxX = Math.max(...nodes.map((n) => n.x + n.width));
        const minY = Math.min(...nodes.map((n) => n.y));
        const maxY = Math.max(...nodes.map((n) => n.y + n.height));

        fitToBounds({
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        });
      }
    }, [nodes, fitToBounds]);

    if (buildError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <Card className="max-w-md mx-4 p-8 text-center shadow-2xl border-2 border-red-200 bg-red-50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">No Root Person Found</h3>
            <p className="text-red-700 mb-4 text-sm font-mono">{buildError}</p>
            <p className="text-gray-600 mb-6 text-sm">
              Every family tree needs one member marked as the root (starting point).
            </p>
            <div className="flex gap-2 flex-col">
              <a href={`/setup-root?treeId=${treeId}`}>
                <Button className="w-full gap-2">
                  <span>⚙️</span>
                  Set Root Person
                </Button>
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Redirecting you to automatic setup...
              </p>
            </div>
          </Card>
        </div>
      );
    }

    if (validationErrors.length > 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <Card className="max-w-md mx-4 p-8 text-center shadow-2xl border-2 border-yellow-200 bg-yellow-50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Phase 1 Constraint Violation</h3>
            <div className="text-left space-y-2 mb-6">
              {validationErrors.map((error, idx) => (
                <p key={idx} className="text-yellow-700 text-xs">
                  • {error}
                </p>
              ))}
            </div>
            <p className="text-gray-600 text-sm">
              Phase 1 does not support multiple spouses or disconnected family members
            </p>
          </Card>
        </div>
      );
    }

    if (familyMembers.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <Card className="max-w-md mx-4 p-8 text-center shadow-2xl border-2">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Start Your Family Tree</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Begin your journey by adding family members and building your heritage story
            </p>
            {onAddMember && familyMembers.length === 0 && (
              <Button onClick={() => onAddMember('parent', familyMembers[0])} size="lg" className="gap-2 px-6 shadow-md">
                Add First Member
              </Button>
            )}
          </Card>
        </div>
      );
    }

    // Calculate SVG dimensions
    const svgWidth = 1400;
    const svgHeight = nodes.length > 0
      ? Math.max(1000, Math.max(...nodes.map((n) => n.y + n.height)) + 200)
      : 1000;

    return (
      <div className="relative w-full h-full bg-linear-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
        {/* SVG Canvas */}
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${zoomPanState.translateX}px, ${zoomPanState.translateY}px) scale(${zoomPanState.scale})`,
            transformOrigin: '0 0',
            transition: 'none',
          }}
        >
          {/* Background grid (optional subtle pattern) */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

          {/* Connection lines between parents and children */}
          {nodes.map((node) =>
            node.children.map((child) => {
              const parentX = node.x + node.width / 2;
              const parentY = node.y + node.height;

              const childX = child.x + child.width / 2;
              const childY = child.y;

              const midY = (parentY + childY) / 2;

              return (
                <path
                  key={`line-${node.id}-${child.id}`}
                  d={`M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`}
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  fill="none"
                  style={{ pointerEvents: 'none' }}
                />
              );
            })
          )}

          {/* Marriage lines (spouse connections) */}
          {nodes.map((node) => {
            if (!node.spouse) return null;

            const person1X = node.x + node.width;
            const person1Y = node.y + node.height / 2;
            const person2X = node.x + node.width + 32; // 12px gap + connection line

            return (
              <line
                key={`spouse-${node.id}-${node.spouse.id}`}
                x1={person1X}
                y1={person1Y}
                x2={person2X}
                y2={person1Y}
                stroke="#10b981"
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* Render all tree nodes */}
          {nodes.map((node) => {
            const hasSpouse = !!node.spouse;
            const hasParents = relationships.some(
              (r) => r.relationship_type === 'parent_child' && r.person2_id === node.id
            );

            return (
              <TreeNode
                key={node.id}
                node={node}
                scale={zoomPanState.scale}
                isSelected={selectedMember?.id === node.id}
                onSelect={(memberId) => {
                  const member = familyMembers.find((m) => m.id === memberId);
                  if (member) onSelectMember(member);
                }}
                onAddMember={onAddMember}
                hasSpouse={hasSpouse}
                hasParents={hasParents}
              />
            );
          })}
        </svg>

        {/* Controls */}
        <div className="absolute bottom-6 left-6 flex gap-2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoomPan}
            className="gap-2 shadow-lg"
            title="Reset zoom and pan (Ctrl+0)"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Zoom Info */}
        <div className="absolute bottom-6 right-6 text-sm text-gray-500 bg-white/80 px-3 py-1 rounded border border-gray-200 z-10">
          {Math.round(zoomPanState.scale * 100)}%
        </div>

        {/* Instructions */}
        <div className="absolute top-6 right-6 text-sm text-gray-600 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-gray-200 max-w-xs z-10">
          <p>🖱️ <strong>Scroll:</strong> Zoom | <strong>Middle/Right Drag:</strong> Pan</p>
          <p>👆 <strong>Click:</strong> Select Member | <strong>Click Buttons:</strong> Add Relations</p>
        </div>
      </div>
    );
  }
);

TreeCanvas.displayName = 'TreeCanvas';
