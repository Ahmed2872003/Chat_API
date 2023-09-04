export default (currDate) => {
  // 9/4/2023, 4:40:00 PM
  currDate = new Date(currDate).toLocaleString("en-uS", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // gets the timeZone identifier of your country
  }); // converts the time to current country time

  let [date, time] = currDate.split(", ");

  time = time.split(/:|\s/);

  return { date, time: `${time[0]}:${time[1]} ${time[3]}` };
};
