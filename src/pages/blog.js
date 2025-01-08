function blogTable() {
  $('.table_component').appendTo('#table-destination')

  const tableHeadRaw = $('.blog-table_head').html()
  const headItems = tableHeadRaw.split('<p>--</p>')

  const tableBodyRaw = $('.blog-table_body').html()

  // First split by '&&' to get each row
  const tableRowsRaw = tableBodyRaw.split('<p>%%</p>')

  // Now process each row by splitting it into cells using '--'
  const tableRows = tableRowsRaw.map((row) => row.split('<p>--</p>'))

  // Append table headers
  headItems.forEach((item) => {
    $(`<th class="table_header">${item}</th>`).appendTo('.table_head .table_row')
  })

  // Append table body rows and cells
  tableRows.forEach((row) => {
    // Create a new table row element
    const tableRow = $('<tr class="table_row"></tr>')

    // Loop through each cell in the row and append it as a <td> element
    row.forEach((cell) => {
      tableRow.append(`<td class="table_cell extra-right-padding">${cell}</td>`)
    })

    // Append the constructed row to the table body
    tableRow.appendTo('.table_body')
  })
}

blogTable()
