export default (currDate) => {
  // 2023-02-25T23:19:06.092Z
  currDate = currDate.split(".");
  currDate.pop();

  currDate = currDate[0].split("T");

  const time = currDate[1].split(":");

  let ampm = +time[0] + 2 >= 12 ? "PM" : "AM";

  let hours = (+time[0] + 2) % 12;

  hours = !hours ? 12 : hours;

  return { date: currDate[0], time: `${hours}:${time[1]} ${ampm}` };
};
