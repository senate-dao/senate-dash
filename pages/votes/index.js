/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy, useFilters, useAsyncDebounce} from 'react-table'
import { get_votes } from '../../src/votes';
import { styled as mustyled } from '@mui/material/styles';
import MaUTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`
// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

const StyledTableCell = mustyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = mustyled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn, // Be sure to pass the defaultColumn option
    filterTypes,
  },
    useFilters, // useFilters!
    useSortBy
  )

  // Render the UI for your table
  return (
    <MaUTable {...getTableProps()} sx={{ minWidth: 700 }}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <StyledTableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <StyledTableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </StyledTableCell>
            ))}
          </StyledTableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <StyledTableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <StyledTableCell {...cell.getCellProps()}>{cell.render('Cell')}</StyledTableCell>
              })}
            </StyledTableRow>
          )
        })}
      </TableBody>
    </MaUTable>
  )
}

function Votes() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Voter',
        columns: [
          {
            Header: "Choice",
            accessor: "choice"
          },]
      },
      {
        Header: "Proposal",
        columns: [{
          Header: 'Title',
          accessor: 'proposal.title',
        }, {
          Header: 'Link',
          accessor: 'proposal.link',
          Cell: ({ cell: { value } }) => <a href={value}>{value}</a>
        }, {
          Header: 'Start Date',
          accessor: 'proposal.proposal_create_date',
        }, {
          Header: 'End Date',
          accessor: 'proposal.proposal_end_date',
        }
        ]
      },
      {
        Header: "dao",
        columns: [{
          Header: 'ID',
          accessor: "dao.id"
        }, {
          Header: 'Name',
          accessor: "dao.name"
        },
        ]
      },
      {
        Header: "Rational",
        Cell: 
        <textarea id="story" name="story"
          rows="5" cols="33"></textarea>,
      },
    ],
    []
  )

  const [data, setData] = useState([]);

  const [address, setAddress] = useState("0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const votes = await get_votes(address, 0);

    if (votes.votes) {
      setData(votes.votes);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <Styles>
        <Table columns={columns} data={data} />
      </Styles>
    </div>
  )
}

export default Votes
