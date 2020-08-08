import React, { Component } from "react";
import * as userListActions from "../../store/actions/userList";
import { connect } from "react-redux";

import "./UsersList.scss";
import { Row, Col, Radio, Skeleton } from "antd";
import UserTable from "./UserTable/UserTable";
import SortHelper from "../../utils/sortHelper";

const mapStateToProps = (state) => {
  const {
    usersListReducer: { userListData },
    appSettingsReducer: { showPreloader },
  } = state;
  return {
    userListData,
    showPreloader,
  };
};
const actionCreators = {
  fetchUsers: userListActions.fetchUsers,
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
    sortValues: {
      sortValue: "id",
      ascendingValue: "ascending",
      viewValue: "tableView",
    },

    tableData: null,
  };
  handleClick = () => {
    console.log("click is happen");
    this.props.startIncrement(1);
  };

  componentDidMount() {
    this.props.fetchUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("from update", this.state);
    if (prevProps.userListData !== this.props.userListData) {
      this.setState({
        tableData: this.props.userListData,
      });
    }
  }

  defineSorting = (val) => {
    const { tableData } = this.state;
    let sortedData = null;
    switch (val.sortValue) {
      case "id":
        // sort by id
        sortedData = SortHelper.sortById(val.ascendingValue, tableData);
        this.setState({
          tableData: [...sortedData],
        });
        break;
      case "name":
        // sort by name
        sortedData = SortHelper.sortByName(val.ascendingValue, tableData);
        this.setState({
          tableData: [...sortedData],
        });
        break;
      case "age":
        // sort by age
        sortedData = SortHelper.sortByAge(val.ascendingValue, tableData);
        this.setState({
          tableData: [...sortedData],
        });
        break;
      default:
        break;
    }
  };

  handleSortChange = (e) => {
    // менять сортировку по data-index добавить у Radio data-index
    const sortTarget = e.target["data-sort"];
    const sortValue = e.target.value;
    const updSortValues = this.state.sortValues;
    updSortValues[sortTarget] = sortValue;
    this.defineSorting(updSortValues);

    this.setState({
      sortValues: { ...updSortValues },
    });
  };

  prepareOptions = (dataOptions) => {
    const renderOptions = dataOptions.map((opt) => (
      <Radio.Button data-sort={opt.dataSet} value={opt.value}>
        {opt.label}
      </Radio.Button>
    ));
    return renderOptions;
  };

  render() {
    const {
      sortValues: { sortValue, ascendingValue, viewValue },
      tableData,
    } = this.state;
    const { showPreloader } = this.props;
    const renderSortButtons = this.prepareOptions(sortOptions);
    const renderSortButtonsByIncrease = this.prepareOptions(byIncreaseOptions);
    const renderPreviewButtons = this.prepareOptions(viewOptions);
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
            {showPreloader ? (
              <Skeleton active />
            ) : (
              <UserTable userData={tableData} />
            )}
          </div>
        </Row>
      </Row>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(UsersList);
