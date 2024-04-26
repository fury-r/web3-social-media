function GenOrdinalDate(x) {
  switch (x % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    default:
      return 'th'
  }
}

function formatDate(date) {
  var newFormattedString = ''
  var myDate = new Date(date)

  newFormattedString +=
    myDate.getDate() +
    GenOrdinalDate(myDate.getDate()) +
    ' ' +
    myDate.toLocaleString('default', { month: 'long' }) +
    ' ' +
    myDate.getFullYear()

  return newFormattedString
}

export default formatDate
