class SortHelper {

  sortById(ascendingVal, data) {
    // ascendingVal - значение по возрастанию или по убыванию
    let sortedData = data;
    if (ascendingVal === "ascending") {
      sortedData.sort((a, b) => a.id - b.id);
    } else {
      sortedData.sort((a, b) => {
        if (a.id < b.id) {
          return 1;
        }
        if (a.id > b.id) {
          return -1;
        }
        return 0;
      });
    }
    return sortedData;
  }

  sortByName = (ascendingVal, data) => {
    let sortedData = data;
    if (ascendingVal === "ascending") {
      sortedData.sort((a, b) => {
        if (a.name[0] < b.name[0]) {
          return -1;
        }
        if (a.name[0] > b.name[0]) {
          return 1;
        }
        return 0;
      });
    } else {
      sortedData.sort((a, b) => {
        if (a.name[0] < b.name[0]) {
          return 1;
        }
        if (a.name[0] > b.name[0]) {
          return -1;
        }
        return 0;
      });
    }
    return sortedData;
  };
  
  sortByAge = (ascendingVal, data) => {
    let sortedData = data;
    if (ascendingVal === "ascending") {
      sortedData.sort((a, b) => {
        if (a.age < b.age) {
          return -1;
        }
        if (a.age > b.age) {
          return 1;
        }
        return 0;
      });
    } else {
      sortedData.sort((a, b) => {
        if (a.age < b.age) {
          return 1;
        }
        if (a.age > b.age) {
          return -1;
        }
        return 0;
      });
    }
    return sortedData;
  };

}

const instance = new SortHelper();
export default instance;
