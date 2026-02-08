import FamilyTreeBuilder from '@/components/family-tree/FamilyTreeBuilder';


interface PageProps {
    params: Promise<{
        treeId: string;
    }>;
}

export default async function TreePage({ params }: PageProps) {
    const { treeId } = await params;

    return (
        <>
            <FamilyTreeBuilder treeId={treeId} />
        </>
    );
}
