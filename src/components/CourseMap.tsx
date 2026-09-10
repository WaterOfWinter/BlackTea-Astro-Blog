import { useMemo } from 'react';
import ReactFlow, {
	Background,
	Controls,
	MarkerType,
	type Edge,
	type Node,
	type NodeClickHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

import courseMap from '../data/course-map.json';

type CourseMapNode = {
	id: string;
	label: string;
	category?: string;
	link?: string;
};

type CourseMapEdge = {
	source: string;
	target: string;
	type?: string;
};

type CourseMapData = {
	nodes?: CourseMapNode[];
	edges?: CourseMapEdge[];
};

const nodeBackgroundByCategory: Record<string, string> = {
	required: '#e5e7eb',
	signals: '#cffafe',
};

export default function CourseMap() {
	const { nodes, edges } = courseMap as CourseMapData;

	const flowNodes = useMemo<Node[]>(() => {
		return (nodes ?? []).map((node, index) => {
			const category = node.category ?? 'required';

			return {
				id: node.id,
				position: {
					x: (index % 2) * 260,
					y: Math.floor(index / 2) * 140,
				},
				data: {
					label: node.label,
					link: node.link,
				},
				style: {
					background: nodeBackgroundByCategory[category] ?? '#f3f4f6',
					border: '1px solid #9ca3af',
					borderRadius: '12px',
					color: '#111827',
					fontSize: '14px',
					fontWeight: 600,
					padding: '12px 16px',
					boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
					minWidth: '140px',
				},
			};
		});
	}, [nodes]);

	const flowEdges = useMemo<Edge[]>(() => {
		return (edges ?? []).map((edge, index) => {
			const isRecommended = edge.type === 'recommended';

			return {
				id: `${edge.source}-${edge.target}-${index}`,
				source: edge.source,
				target: edge.target,
				type: 'smoothstep',
				markerEnd: {
					type: MarkerType.ArrowClosed,
					width: 18,
					height: 18,
				},
				style: {
					stroke: '#4b5563',
					strokeWidth: 2,
					strokeDasharray: isRecommended ? '5,5' : undefined,
				},
			};
		});
	}, [edges]);

	const handleNodeClick: NodeClickHandler = (_event, node) => {
		const link = node.data?.link as string | undefined;

		if (link) {
			window.location.href = link;
		}
	};

	return (
		<div style={{ width: '100%', height: '600px' }}>
			<ReactFlow
				nodes={flowNodes}
				edges={flowEdges}
				onNodeClick={handleNodeClick}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
			>
				<Background gap={24} size={1} color="#e5e7eb" />
				<Controls />
			</ReactFlow>
		</div>
	);
}
