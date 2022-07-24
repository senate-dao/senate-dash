/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <MaUTable {...getTableProps()} sx={{ minWidth: 700 }}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <StyledTableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <StyledTableCell {...column.getHeaderProps()}>{column.render('Header')}</StyledTableCell>
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
        Header: "Resonal",
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
