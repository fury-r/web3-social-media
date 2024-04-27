import FormatDate from './formatDate'

function RenderText(inputText, inputDate) {
  inputText = inputText ? inputText : 'No Entry for today'
  inputDate = inputDate ? inputDate : new Date().toLocaleDateString()

  return (
    <div className='m-2 text-2xl whitespace-pre-line'>
      {inputDate && (
        <p className='text-4xl pb-5 font-bold'>{FormatDate(inputDate)}</p>
      )}
      <p>{inputText}</p>
    </div>
  )
}

export default RenderText
