/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect, useMemo } from 'react';
import { useRowSelect, useTable } from 'react-table';

import { DAM_ASSETS_FIELD_KEY } from 'aesirx-dma-lib';
import { useTranslation, withTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './index.module.scss';
import ChooseAction from '../ChooseAnAction';
import ListCheck from '../../SVG/ListCheck';
import ThumbNails from '../../SVG/ThumbNails';

const ComponentNoData = React.lazy(() => import('../ComponentNoData'));
const Thumb = React.lazy(() => import('./Thumb'));
const Select = React.lazy(() => import('../Select'));
const ArrowBack = React.lazy(() => import('SVG/ArrowBack'));
const ThumbDragLayer = React.lazy(() => import('./ThumbDragLayer'));

// let dataFilter = {
//   searchText: '',
//   columns: [],
//   titleFilter: {},
//   datetime: null,
//   page: '',
// };

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <input
      className="form-check-input p-0 w-100 h-100"
      type="checkbox"
      ref={resolvedRef}
      {...rest}
    />
  );
});

const Table = ({
  rowData = [],
  tableRowHeader = [],
  // onSelect,
  isThumb,
  dataList,
  dataThumb,
  thumbColumnsNumber,
  noSelection = false,
  isList = true,
  listViewModel,
  _handleList,
  classNameTable,
  onDoubleClick,
  // createFolder,
  createAssets,
  onFilter,
  onSortby,
  onRightClickItem,
  onBackClick,
  dataCollections,
  onSelectionChange,
  // dataAssets,
}) => {
  const { t } = useTranslation('common');

  const columns = useMemo(() => tableRowHeader, [tableRowHeader]);

  const data = useMemo(() => rowData, [rowData]);

  const filterBar = useMemo(() => ({
    id: 'type',
    className: 'border-end border-gray-select col-auto',
    placeholder: t('txt_type'),
    options: [
      {
        label: t('txt_type'),
        value: '',
      },
      {
        label: t('txt_image'),
        value: 'image',
      },
      {
        label: t('txt_video'),
        value: 'video',
      },
      {
        label: t('txt_document'),
        value: 'document',
      },
      {
        label: t('txt_audio'),
        value: 'audio',
      },
    ],
  }));

  const sortBy = useMemo(() => ({
    id: 'sort_by',
    placeholder: t('txt_sort_by'),
    className: 'border-end border-gray-select col-auto',
    options: [
      {
        label: t('txt_sort_by'),
        value: {
          ordering: '',
          direction: '',
        },
      },
      {
        label: t('txt_date_create'),
        value: {
          ordering: DAM_ASSETS_FIELD_KEY.CREATE_DATE,
          direction: 'desc',
        },
      },
      {
        label: t('txt_last_modified'),
        value: {
          ordering: DAM_ASSETS_FIELD_KEY.LAST_MODIFIED,
          direction: 'desc',
        },
      },
      {
        label: t('txt_a_z'),
        value: {
          ordering: DAM_ASSETS_FIELD_KEY.NAME,
          direction: 'asc',
        },
      },
      {
        label: t('txt_z_a'),
        value: {
          ordering: DAM_ASSETS_FIELD_KEY.NAME,
          direction: 'desc',
        },
      },
    ],
  }));

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, selectedFlatRows } =
    useTable(
      {
        columns,
        data,
        // onSelect,
        initialState: {
          // hiddenColumns: dataFilter.columns,
          // pageSize: rowData.length ?? -1,
        },
      },
      // usePagination,
      useRowSelect,
      (hooks) => {
        !noSelection &&
          hooks.visibleColumns.push((columns) => [
            {
              id: 'selection',
              Header: ({ getToggleAllRowsSelectedProps }) => (
                <div className={styles.checkbox}>
                  <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                </div>
              ),
              // The cell can use the individual row's getToggleRowSelectedProps method
              // to the render a checkbox
              Cell: ({ row }) => (
                <div className={styles.checkbox}>
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
              ),
            },
            ...columns,
          ]);
      }
    );

  const moveRow = (dragIndex, hoverIndex) => {
    listViewModel.moveToFolder(dragIndex, hoverIndex);
  };

  useEffect(() => {
    console.log(selectedFlatRows);

    return () => {};
  }, [selectedFlatRows]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`mb-4 zindex-3 ${classNameTable}`}>
        <div className="bg-white shadow-sm rounded-3 d-flex align-items-center justify-content-between">
          <div className="wrapper_search_global row">
            <div className={filterBar.className}>
              <Select
                isClearable={false}
                isSearchable={false}
                options={filterBar.options}
                onChange={onFilter}
                value={filterBar.options.find(
                  (e) => e.value === listViewModel.dataFilter['filter[type]']
                )}
              />
            </div>
            <ChooseAction />
            <div className={sortBy.className}>
              <Select
                isClearable={false}
                isSearchable={false}
                options={sortBy.options}
                onChange={onSortby}
                value={sortBy.options.find(
                  (e) =>
                    e.value.ordering === listViewModel.dataFilter['list[ordering]'] &&
                    e.value.direction === listViewModel.dataFilter['list[direction]']
                )}
              />
            </div>
          </div>
          {isThumb && (
            <div className="d-flex align-items-center">
              <button
                type="button"
                className={`btn d-flex align-items-center fw-bold rounded-0 px-4 shadow-none ${
                  isList ? 'bg-blue-3 text-white' : 'text-blue-6'
                }`}
                onClick={() => _handleList('list')}
              >
                <ListCheck className={isList ? styles.active : styles.inactive} />
                <span className="ms-2">{t('txt_list')}</span>
              </button>
              <button
                type="button"
                className={`btn d-flex align-items-center fw-bold rounded-0 px-4 shadow-none ${
                  !isList ? 'bg-blue-3 text-white' : 'text-blue-6'
                }`}
                onClick={() => _handleList('thumb')}
              >
                <ThumbNails className={!isList ? styles.active : styles.inactive} />
                <span className="ms-2">{t('txt_thumb')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <ThumbDragLayer />
      {isList ? (
        <div className="py-3 rounded-3 col">
          {rows.length ? (
            <table {...getTableProps()} className={`w-100 bg-white shadow mb-4 ${classNameTable}`}>
              <thead>
                {headerGroups.map((headerGroup) => {
                  let newHeaderGroup = '';

                  dataList
                    ? (newHeaderGroup = headerGroup.headers.filter(
                        (item) => !dataList.some((other) => item.id === other)
                      ))
                    : (newHeaderGroup = headerGroup.headers);

                  return (
                    <tr
                      key={Math.random(40, 200)}
                      {...headerGroup.getHeaderGroupProps()}
                      className="bg-white border-bottom border-gray-500"
                    >
                      {newHeaderGroup.map((column, index) => {
                        return (
                          <th
                            key={index}
                            {...column.getHeaderProps()}
                            className="fw-normal px-2 py-3 flex-1 bg-white"
                          >
                            {column.render('Header')}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.length > 0 &&
                  rows.map((row, index) => {
                    prepareRow(row);
                    let newRowCells = '';

                    dataList
                      ? (newRowCells = row.cells.filter(
                          (item) => !dataList.some((other) => item.column.id === other)
                        ))
                      : (newRowCells = row.cells);

                    return (
                      <Thumb
                        {...row.getRowProps()}
                        isList={true}
                        className={`zindex-2 ${index % 2 === 0 ? 'bg-gray-400' : 'bg-white'}`}
                        key={Math.random(40, 200)}
                        newRowCells={newRowCells}
                        index={index}
                        row={row}
                        onDoubleClick={onDoubleClick}
                        onRightClickItem={onRightClickItem}
                        moveRow={moveRow}
                        type={row.original[DAM_ASSETS_FIELD_KEY.TYPE] ? 'assets' : 'folder'}
                        onSelectionChange={onSelectionChange}
                      />
                    );
                  })}
              </tbody>
            </table>
          ) : null}
        </div>
      ) : (
        <div {...getTableBodyProps()} className={`row ${rows.length === 0 ? 'col' : ''}`}>
          {rows.length
            ? rows.map((row, index) => {
                prepareRow(row);
                let newRowCells = row.cells;
                if (dataThumb && dataThumb.length > 0) {
                  newRowCells = row.cells.filter(
                    (item) => !dataThumb.some((other) => item.column.id === other)
                  );
                }

                return (
                  newRowCells.length > 0 && (
                    <React.Fragment key={row?.original?.id}>
                      {index === 0 && !row.original[DAM_ASSETS_FIELD_KEY.TYPE] && (
                        <>
                          <div className="col-12">
                            <p className="fw-bold text-blue-0">{t('txt_folders')}</p>
                          </div>
                          {listViewModel?.damLinkFolder.split('/').length > 1 && (
                            <div
                              className={`col_thumb ${styles.col_thumb} col-${
                                !thumbColumnsNumber ? '3' : thumbColumnsNumber
                              } mb-4 zindex-2`}
                            >
                              <div
                                className={`item_thumb d-flex cursor-pointer align-items-center justify-content-center  shadow-sm h-100 rounded-2 overflow-hidden flex-column bg-white
                      `}
                                onClick={onBackClick}
                              >
                                <ArrowBack />
                                <span>{t('txt_back')}</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {dataCollections.length === index &&
                        row.original[DAM_ASSETS_FIELD_KEY.TYPE] && (
                          <>
                            <div className="col-12">
                              <p className="fw-bold text-blue-0">{t('txt_file')}</p>
                            </div>
                            {index === 0 && listViewModel?.damLinkFolder.split('/').length > 1 && (
                              <div
                                className={`col_thumb ${styles.col_thumb} col-${
                                  !thumbColumnsNumber ? '3' : thumbColumnsNumber
                                } mb-4 zindex-2`}
                              >
                                <div
                                  className={`item_thumb d-flex cursor-pointer align-items-center justify-content-center  shadow-sm h-100 rounded-2 overflow-hidden flex-column bg-white
              `}
                                  onClick={onBackClick}
                                >
                                  <ArrowBack />
                                  <span>{t('txt_back')}</span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      <Thumb
                        {...row.getRowProps()}
                        className={`col_thumb ${styles.col_thumb} col-${
                          !thumbColumnsNumber ? '3' : thumbColumnsNumber
                        } mb-4 zindex-2`}
                        newRowCells={newRowCells}
                        index={index}
                        row={row}
                        onDoubleClick={onDoubleClick}
                        onRightClickItem={onRightClickItem}
                        moveRow={moveRow}
                        type={row.original[DAM_ASSETS_FIELD_KEY.TYPE] ? 'assets' : 'folder'}
                        onSelectionChange={onSelectionChange}
                      />
                    </React.Fragment>
                  )
                );
              })
            : null}
        </div>
      )}
      {rows.length === 0 && (
        <>
          <p onClick={onBackClick} className="d-flex zindex-2 align-items-center cursor-pointer">
            {listViewModel?.damLinkFolder.split('/').length > 1 && (
              <>
                <ArrowBack /> <span className="fw-semibold ps-2">{t('txt_back')}</span>
              </>
            )}
          </p>
          <ComponentNoData
            icons="/assets/images/ic_project.svg"
            title="No Matching Results"
            text="Can not found any project with that keyword. Please try another keyword."
            width="w-50"
            createAssets={createAssets}
          />
        </>
      )}
    </DndProvider>
  );
};

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

export default withTranslation('common')(Table);
