import { useDroppable } from "@dnd-kit/react";

type DroppableProps = {
    id: string;
    children: React.ReactNode;
}

export default function Droppable({id, children}: DroppableProps ) {
    const {ref} = useDroppable({
        id,
    })
  return (
    <div ref={ref} className="w-full">
        {children}
    </div>
  )
}
