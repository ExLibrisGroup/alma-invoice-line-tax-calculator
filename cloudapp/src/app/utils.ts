const sortByProperty = property => (a,b) => (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;

export { sortByProperty };