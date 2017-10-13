const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "Febuary", "March", "April", "May", "June", "Jully", "August", "September", "October", "November", "December"];

const prefixDate = date => date === 1 ? 'st' : date === 2 ? 'nd' : date === 3 ? 'rd' : 'th';

module.exports = date => `${days[date.getDay()]} the ${date.getDate()}${prefixDate(date.getDate())} of ${months[date.getMonth()]} ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;;