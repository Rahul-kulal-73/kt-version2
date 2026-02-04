import React from 'react';
import { Pencil, Network, Crown } from 'lucide-react';
import { FamilyMember } from '@/components/hooks/useFamilyTree';
import styles from './family-tree.module.css';

interface MemberCardProps {
    member: FamilyMember;
    isSelected?: boolean;
    isRoot?: boolean;
    onClick: () => void;
    onAddParent?: () => void;
    onAddSpouse?: () => void;
    onAddChild?: () => void;
    onNodeDelete?: () => void;
    hasHiddenFamily?: boolean;
    onViewFamily?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
    member,
    isSelected,
    isRoot,
    onClick,
    onAddChild,
    onNodeDelete,
    hasHiddenFamily,
    onViewFamily,
}) => {
    const birthYear = member.birth_date ? new Date(member.birth_date).getFullYear() : '';
    const isDeceased = !!member.death_date;

    const genderClass = member.gender === 'male' ? styles.male : member.gender === 'female' ? styles.female : styles.other;
    const rootClass = isRoot ? styles.focusedRoot : '';
    const nodeClasses = `${styles.node} ${genderClass} ${rootClass}`;

    return (
        <div
            className={nodeClasses}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            style={{
                // Optional: selection highlight could be a glow instead of border change to preserve gender color
                boxShadow: isSelected ? '0 0 0 3px rgba(66, 153, 225, 0.5)' : undefined
            }}
        >
            {/* Network Icon for "View Family" */}
            {hasHiddenFamily && !isRoot && (
                <button
                    className={styles.dumbbellBtn}
                    style={{ border: '2px solid green' }}
                    title="View Family"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewFamily?.();
                    }}
                >
                    <Network size={14} />
                </button>
            )}

            {/* Avatar Wrapper */}
            <div style={{ position: 'relative' }}>
                <div className={styles.avatar}>
                    {member.photo_url ? (
                        <img src={member.photo_url} alt={member.first_name} />
                    ) : (
                        member.first_name[0]
                    )}
                </div>
                {member.is_root && (
                    <div
                        className="absolute -top-2 left-1/2 -translate-x-1/5 bg-yellow-400 text-yellow-900 rounded-full p-1 shadow-sm border-[1.5px] border-white z-20 flex items-center justify-center"
                        title="Tree Owner"
                        style={{ width: '20px', height: '20px' }}
                    >
                        <Crown size={12} fill="currentColor" strokeWidth={2.5} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <div className={styles.name}>
                    {member.first_name} {member.middle_name ? member.middle_name + ' ' : ''}{member.last_name}
                </div>
                <div className={styles.details}>
                    {birthYear}
                    {isDeceased && ' - Deceased'}
                </div>
            </div>

            {/* Edit Button (Pencil) - Visual trigger for selection/edit */}
            <button className={styles.editBtn} aria-label="Edit">
                <Pencil size={14} />
            </button>

            {/* Actions Overlay - The "Hanging" Add Button */}
            <div className={styles.actionsOverlay}>
                <button
                    className={`${styles.actBtn} ${styles.addC}`}
                    title="Add Relation"
                    onClick={(e) => { e.stopPropagation(); onAddChild?.(); }}
                >
                    +
                </button>
            </div>
        </div>
    );
};
