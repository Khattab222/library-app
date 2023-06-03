import moment from "moment";


 // function to update the date and late and fine 
export const updateBooksfine = (books) => {
    for (const book of books) {
        // calculate late and fine
        let now = moment(new Date());
        let end = moment(book.returndDate)
        let duration = moment.duration(end.diff(now));
        let days =Math.floor( duration.asDays());
      
          book.late = days< 0?Math.abs(days) : 0
          book.fine =days<0?Math.abs(days) * 50 : 0  // in dollars
      }
      return books
}
