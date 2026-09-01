// import {
//   closestCenter,
//   DndContext,
//   DragEndEvent,
//   DraggableAttributes,
// } from "@dnd-kit/core";
// import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
import { Empty } from "antd";
import React from "react";

import styles from "./sortable-list.module.scss";

interface DataProps {
  id: string | number;
  label: string;
  value: string;
  disabled?: boolean;
}

interface SortableListProps {
  data: DataProps[];
  onChange?: (list: DataProps[]) => void;
  draggable?: boolean;
  style?: React.CSSProperties;
}

// interface SortableItemProps {
//   item: DataProps;
//   draggable?: boolean;
//   style?: React.CSSProperties;
// }

// interface SortableListItemContextProps {
//   setActivatorNodeRef?: (element: HTMLElement | null) => void;
//   listeners?: SyntheticListenerMap;
//   attributes?: DraggableAttributes;
// }

// const SortableListItemContext = createContext<SortableListItemContextProps>({});

// const DragHandle: React.FC = () => {
//   const { setActivatorNodeRef, listeners, attributes } = useContext(
//     SortableListItemContext,
//   );
//   return (
//     <Button
//       type="text"
//       size="small"
//       icon={<HolderOutlined />}
//       style={{ cursor: "move" }}
//       ref={setActivatorNodeRef}
//       {...attributes}
//       {...listeners}
//     />
//   );
// };

// const SortableItem = ({ item, style, draggable = true }: SortableItemProps) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     setActivatorNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id: item.id, disabled: item.disabled });

//   const _style: React.CSSProperties = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     padding: "8px",
//     opacity: !draggable ? 1 : item.disabled ? 0.6 : 1,
//     // borderBottom: "1px solid #eee",
//     background: "#fff",
//     display: "flex",
//     justifyContent: "start",
//     alignItems: "center",
//     gap: "1rem",
//     overflow: "hidden",
//     width: "100%",
//     ...style,
//   };

//   if (!draggable && typeof item.label !== "object") {
//     return (
//       <div style={_style}>
//         <div className={styles["route-information-container"]}>
//           <div className={styles["route-information"]}>
//             <div title={item.label}>{item.label}</div>
//             <div title={item.value}>{item.value}</div>
//           </div>
//         </div>
//       </div>
//     );
//   } else if (!draggable) {
//     <div style={_style}>{item.label}</div>;
//   }

//   return (
//     <SortableListItemContext.Provider
//       value={{ setActivatorNodeRef, listeners, attributes }}
//     >
//       <div ref={setNodeRef} style={_style}>
//         <DragHandle />
//         <div
//           style={{
//             flex: 1,
//             width: "100%",
//           }}
//         >
//           {item.label}
//         </div>
//       </div>
//     </SortableListItemContext.Provider>
//   );
// };

const SortableList = ({ data }: SortableListProps) => {
  const items = data;
  // const [items, setItems] = useState<DataProps[]>(_data);

  // const handleDragEnd = () => {
  //   const { active, over } = e;
  //   if (!over) return;
  //   if (active.id !== over.id) {
  //     setItems((prev) => {
  //       const activeItem = prev.find((i) => i.id === active.id);
  //       const overItem = prev.find((i) => i.id === over.id);
  //       // BLOCK ANY MOVEMENT INTO A FIXED ITEM
  //       if (overItem?.disabled) return prev;
  //       // IF active item is fixed, block moving it
  //       if (activeItem?.disabled) return prev;
  //       const oldIndex = prev.findIndex((i) => i.id === active.id);
  //       const newIndex = prev.findIndex((i) => i.id === over.id);
  //       const newOrder = arrayMove(prev, oldIndex, newIndex);
  //       onChange?.(newOrder);
  //       return newOrder;
  //     });
  //   }
  // };

  if (!items.length) {
    return <Empty />;
  }

  return items.map((item) => (
    <div key={item.id} className={styles["route-items"]}>
      <div className={styles["route-information-container"]}>
        <div className={styles["route-information"]}>
          <div title={item.label}>{item.label}</div>
          <div title={item.value}>{item.value}</div>
        </div>
      </div>
    </div>
  ));
  // <div>
  //   <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  //     <SortableContext
  //       items={items.map((i) => i.id)}
  //       strategy={verticalListSortingStrategy}
  //       disabled={!draggable}
  //     >
  //       {items.map((item) => (
  //         <SortableItem
  //           key={item.id}
  //           item={item}
  //           draggable={draggable}
  //           style={style}
  //         />
  //       ))}
  //     </SortableContext>
  //   </DndContext>
  // </div>
};

export default SortableList;
