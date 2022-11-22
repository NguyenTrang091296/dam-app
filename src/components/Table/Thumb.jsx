/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { DAM_ASSETS_FIELD_KEY } from 'aesirx-dma-lib/src/Constant/DamConstant';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styles from './index.module.scss';

const DND_ITEM_TYPE = 'row';

function Thumb({ row, className, newRowCells, index, moveRow, onDoubleClick, onRightClickItem }) {
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const [{ isOver }, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop: (item, monitor) => {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
      };
    },
  });

  const [{ opacity }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  preview(drop(dropRef));
  drag(dragRef);
  return (
    <div ref={dropRef} style={{ opacity }} className={className}>
      {/* <div >move</div> */}
      <div
        ref={dragRef}
        className={`item_thumb d-flex cursor-move align-items-center justify-content-center  shadow-sm h-100 rounded-2 overflow-hidden flex-column ${
          isOver ? 'border border-success bg-gray-dark' : 'bg-white'
        }`}
        onDoubleClick={
          row.original[DAM_ASSETS_FIELD_KEY.TYPE] ? () => {} : () => onDoubleClick(row.original.id)
        }
        onContextMenu={(e) => {
          onRightClickItem(e, row.original);
        }}
      >
        {newRowCells.map((cell) => {
          return (
            <div
              {...cell.getCellProps()}
              className={`ct_cell ${styles.ct_cell} d-block`}
              key={Math.random(40, 200)}
            >
              {cell.render('Cell')}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Thumb;