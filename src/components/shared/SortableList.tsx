"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Drag Handle Properties Type ──────────────────────────────────────────────
export type DragHandleProps = Record<string, unknown>;

// ─── Sortable Item Wrapper ─────────────────────────────────────────────────────
interface SortableItemProps {
  id: string;
  children: (props: { dragHandleProps: DragHandleProps; isDragging: boolean }) => React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragHandleProps: { ...attributes, ...listeners } as DragHandleProps, isDragging })}
    </div>
  );
}

// ─── Main SortableList ─────────────────────────────────────────────────────────
interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  renderItem: (item: T, dragHandleProps: DragHandleProps, isDragging: boolean, index: number) => React.ReactNode;
  className?: string;
}

export default function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  className = "",
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className={`flex flex-col gap-2 ${className}`}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {({ dragHandleProps, isDragging }) =>
                renderItem(item, dragHandleProps, isDragging, index)
              }
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// ─── Drag Handle Icon ──────────────────────────────────────────────────────────
export function DragHandle({ dragHandleProps }: { dragHandleProps: DragHandleProps }) {
  return (
    <button
      {...dragHandleProps}
      className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors touch-none"
      title="ড্র্যাগ করে সরান"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
      </svg>
    </button>
  );
}
