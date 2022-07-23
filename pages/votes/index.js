/* eslint-disable react/jsx-key */
import React from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'

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
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function Votes() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Voter',
        columns: [
          {
            Header: "Voter",
            accessor: "voter"
          },
          {
            Header: "Choice",
            accessor: "choice"
          },
          {
            Header: "voted_on",
            accessor: "voted_on"
          },]
      },
      {
        Header: "Proposal",
        columns: [{
          Header: 'proposal',
          accessor: 'proposal.id',
        }, {
          Header: 'Link',
          accessor: 'proposal.link',
        },
          , {
          Header: 'Title',
          accessor: 'proposal.title',
        }, {
          Header: 'State',
          accessor: 'proposal.state',
        }, {
          Header: 'Start Date',
          accessor: 'proposal_create_date',
        }, {
          Header: 'End Date',
          accessor: 'proposal_end_date',
        }, {
          Header: 'Received',
          accessor: 'votes_received',
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
    ],
    []
  )

  const data = [
    {
      "voter": "Me",
      "choice": "Yes",
      "voted_on": "Yes",
      "proposal": {
        "id": "1",
        "link": "mylink",
        "title": "title",
        "proposal_state": "",
        "proposal_create_date": "",
        "proposal_end_date": "",
        "votes_received": ""
      },
      "dao": {
        "id": "",
        "name": ""
      }
    }, {
      "voter": "Me",
      "choice": "Yes",
      "voted_on": "Yes",
      "proposal": {
        "id": "1",
        "link": "mylink",
        "title": "title",
        "proposal_state": "state",
        "proposal_create_date": "123",
        "proposal_end_date": "123",
        "votes_received": "100"
      },
      "dao": {
        "id": "12",
        "name": "My DAO"
      }
    },
  ];

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default Votes
