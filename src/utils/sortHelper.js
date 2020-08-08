class SortHelper {
  sortById(ascendingVal, data) {
    // ascendingVal - значение по возрастанию или по убыванию

    console.log("from helper", data);
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

  swapArray(inputArr, oldPlace, newPlace) {
    const arr = inputArr.slice(); // Копируем массив
    // Проверим выход за пределы массива
    if (
      Math.min(oldPlace, newPlace) < 0 ||
      Math.max(oldPlace, newPlace) >= arr.length
    ) {
      console.error("Out of range");
      return null;
    }
    const item = arr.splice(oldPlace, 1);
    arr.splice(newPlace > 0 ? newPlace : 0, 0, item[0]);
    return arr;
  }

  changeEndOrDayCountViaMode(item, props) {
    // Если сдвиг по таймлайну, тогда не изм. кол-во дней, а изм. end_date с учетом рабочих
    if (props.mode === MODE_MOVE) {
      item.end_date = DateHelper.makeTaskEndDateFromDaysCount(
        props.start_date ? props.start_date : item.start_date,
        item.days_to_complete
      );
    } else {
      item.end_date = moment(
        props.end_date ? props.end_date : item.end_date
      ).format(Config.values.moment.APIFormat);
      item.days_to_complete = DateHelper.getNewDaysCountFromStartAndEnd(
        props.start_date ? props.start_date : item.start_date,
        item.end_date
      );
    }
  }
}

const instance = new SortHelper();
export default instance;
