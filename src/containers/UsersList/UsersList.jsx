import React, { Component } from "react";
import * as userListActions from "../../store/actions/userList";
import { connect } from "react-redux";
import { Row, Col, Radio, Skeleton } from "antd";

import "./UsersList.scss";
import UserTable from "./UserTable/UserTable";
import SortHelper from "../../utils/sortHelper";
import UserPreviewCard from "./UserPreviewCard";

const mapStateToProps = (state) => {
  const {
    usersListReducer: { userListData, favoriteList },
    appSettingsReducer: { showPreloader },
  } = state;
  return {
    userListData,
    showPreloader,
    favoriteList,
  };
};
const actionCreators = {
  fetchUsers: userListActions.fetchUsers,
  addUserToFavorite: userListActions.addUserToFavorite,
  deleteUserFromFavorite: userListActions.deleteUserFromFavorite,
};

const sortOptions = [
  { label: "ID", value: "id", dataSet: "sortValue" },
  { label: "ИМЯ", value: "name", dataSet: "sortValue" },
  { label: "ВОЗРАСТ", value: "age", dataSet: "sortValue" },
];

const byIncreaseOptions = [
  { label: "По возрастанию", value: "ascending", dataSet: "ascendingValue" },
  { label: "По убыванию", value: "descending", dataSet: "ascendingValue" },
];

const viewOptions = [
  { label: "Таблица", value: "tableView", dataSet: "viewValue" },
  { label: "Превью", value: "preview", dataSet: "viewValue" },
];

class UsersList extends Component {
  state = {
    sort: {
      sortValue: "id",
      ascendingValue: "ascending",
      viewValue: "tableView",
    },
    queryString: "",
    filter: { filterString: "" },
    tableData: null,
  };

  componentDidMount() {
    const { sort, filter } = this.state;
    const queryParams = JSON.parse(localStorage.getItem("queryParams"));
    const initialParams = { ...sort };
    if (queryParams) {
      this.props.history.push(this.makeQueryParams(queryParams));
      this.setState({
        sort: { ...queryParams["sort"] },
        filter: { ...queryParams["filter"] },
      });
    } else {
      this.props.history.push(
        this.makeQueryParams({ sort: { ...initialParams } })
      );
      localStorage.setItem(
        "queryParams",
        JSON.stringify({ sort: { ...initialParams } })
      );
    }

    this.props.fetchUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { sort } = this.state;
    if (this.state.tableData && prevState.sort !== this.state.sort) {
      this.defineSorting(this.state.sort);
      this.props.history.push(this.makeQueryParams({ sort: { ...sort } }));
    }
    if (this.state.tableData && prevState.filter !== this.state.filter) {
      ////////// Записываем после выбора ЧЕКБОКСА значение в LS ////////////
      const queryParams = JSON.parse(localStorage.getItem("queryParams"));

      let newUrl = null;
      if (queryParams) {
        queryParams["filter"] = {}; // если не создать таким образом пишет что нет такой property как filter
        queryParams["filter"]["filterString"] = this.state.filter.filterString;
        localStorage.setItem("queryParams", JSON.stringify(queryParams));
        newUrl = queryParams;
      }
      this.props.history.push(this.makeQueryParams({ ...queryParams }));

      ////////// Записываем после выбора ЧЕКБОКСА значение в LS ////////////
    }
    if (prevProps.userListData !== this.props.userListData) {
      this.defineSorting(this.state.sort);
      this.setState({
        tableData: this.props.userListData,
      });
    }
  }

  defineSorting = (val) => {
    const { userListData } = this.props;
    let sortedData = null;
    switch (val.sortValue) {
      case "id":
        // sort by id
        sortedData = SortHelper.sortById(val.ascendingValue, userListData);
        this.setState({
          tableData: [...sortedData],
        });
        break;
      case "name":
        // sort by name
        sortedData = SortHelper.sortByName(val.ascendingValue, userListData);
        this.setState({
          tableData: [...sortedData],
        });
        break;
      case "age":
        // sort by age
        sortedData = SortHelper.sortByAge(val.ascendingValue, userListData);
        this.setState({
          tableData: [...sortedData],
        });
        break;
      default:
        break;
    }
    ////////// Записываем после выбора ЧЕКБОКСА значение в LS ////////////
    const queryParams = JSON.parse(localStorage.getItem("queryParams"));
    let newUrl = null;
    if (queryParams) {
      queryParams["sort"] = { ...val };
      localStorage.setItem("queryParams", JSON.stringify(queryParams));
      // newUrl = queryParams;
      newUrl = { sort: { ...val } };
    } else {
      newUrl = { sort: { ...val } };
    }
    ////////// Записываем после выбора ЧЕКБОКСА значение в LS ////////////
  };

  makeQueryParams = (data) => {
    const qs = new URLSearchParams();
    if (data) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const values = Object.values(data[keys[i]]);
        qs.append([keys[i]], values.join("-"));
      }
    }
    const newUrl = {
      pathname: "/",
      search: qs.toString(),
    };
    return newUrl;
  };

  getFilterValue = (val) => {
    let filter = null;
    if (val) {
      filter = val;
    }
    this.setState({
      filter: { filterString: val },
    });
  };

  handleSortChange = (e) => {
    // менять сортировку по data-index добавить у Radio data-index
    const sortTarget = e.target["data-sort"];
    const sortValue = e.target.value;
    const updSortValues = this.state.sort;
    updSortValues[sortTarget] = sortValue;
    this.defineSorting(updSortValues);

    this.setState({
      sort: { ...updSortValues },
    });
  };

  prepareOptions = (dataOptions) => {
    const renderOptions = dataOptions.map((opt, index) => (
      <Radio.Button key={index} data-sort={opt.dataSet} value={opt.value}>
        {opt.label}
      </Radio.Button>
    ));
    return renderOptions;
  };

  render() {
    const {
      sort: { sortValue, ascendingValue, viewValue },
      tableData,
      filter: { filterString },
    } = this.state;
    const {
      showPreloader,
      addUserToFavorite,
      deleteUserFromFavorite,
      favoriteList,
    } = this.props;
    const renderSortButtons = this.prepareOptions(sortOptions);
    const renderSortButtonsByIncrease = this.prepareOptions(byIncreaseOptions);
    const renderPreviewButtons = this.prepareOptions(viewOptions);
    let renderPreviewCard = null;

    if (tableData) {
      renderPreviewCard = tableData.map((user, index) => {
        const isFavorite = favoriteList.find(
          (favUser) => favUser.id === user.id
        );
        return (
          <UserPreviewCard
            key={index}
            type={user.video ? "preview" : "default"}
            user={user}
            handleAddFavorite={() => addUserToFavorite(user.id)}
            handleDeleteFavorite={() => deleteUserFromFavorite(user.id)}
            isFavorite={isFavorite}
          />
        );
      });
    }

    return (
      <Row className="user-list">
        <Row className="user-list-wrapper">
          <Row className="sort-section">
            <Col span={12}>
              <h3>Сортировка</h3>
              <Radio.Group
                optionType="button"
                onChange={this.handleSortChange}
                value={sortValue}
              >
                {renderSortButtons}
              </Radio.Group>
              <Radio.Group
                optionType="button"
                onChange={this.handleSortChange}
                value={ascendingValue}
              >
                {renderSortButtonsByIncrease}
              </Radio.Group>
            </Col>
            <Col span={12}>
              <Radio.Group
                optionType="button"
                onChange={this.handleSortChange}
                value={viewValue}
              >
                {renderPreviewButtons}
              </Radio.Group>
            </Col>
          </Row>
          <div className="container table-container">
            {/* Table view */}
            {viewValue === "tableView" && (
              <div className="container table-container">
                {showPreloader ? (
                  <Skeleton active />
                ) : (
                  <UserTable
                    getFilterValue={this.getFilterValue}
                    userData={tableData}
                    handleAddFavorite={addUserToFavorite}
                    handleDeleteFavorite={deleteUserFromFavorite}
                    favoriteList={favoriteList}
                  />
                )}
              </div>
            )}

            {/* Preview with video view */}
            {viewValue === "preview" && (
              <div className="user-card_wrapper">{renderPreviewCard}</div>
            )}
          </div>
        </Row>
      </Row>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(UsersList);
