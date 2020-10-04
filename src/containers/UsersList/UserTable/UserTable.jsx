import React, { Component } from "react";
import { Table, Avatar, Input, Space, Button, Highlighter } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import cn from "classnames";
import SubscribeStar from "../SubscribeStar";

const pathToImg = "@images/";

const getPicture = (file) => {
  const path = require(`../../../assets/images/${file}.svg`);
  return path.default;
};

class UserTable extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    filterValue: "",
    isFavourite: false,
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.props.getFilterValue(selectedKeys[0]);
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.props.getFilterValue([]);
    this.setState({ searchText: "" });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text, record) => (
      <>
        {record && (
          <>
            <Avatar size={25} src={getPicture(record.image)} />
            <p style={{ display: "inline-block", marginLeft: 5 }}> {text}</p>
          </>
        )}
      </>
    ),
  });

  prepareTableData = (tableItems) => {
    return tableItems.map((tableItem, index) => {
      tableItem.key = index;
      return tableItem;
    });
  };

  getFilterFromLs = () => {
    const queryParams = JSON.parse(localStorage.getItem("queryParams"));
    let val = null;
    if (queryParams && queryParams["filter"]) {
      const filterValue = queryParams["filter"]["filterString"];
      val = [filterValue];
    }
    return val;
  };

  handleStarActive = (userId) => {
    const { handleAddFavorite, handleDeleteFavorite } = this.props;
    const isFavourite = this.isFavourite(userId);
    if (isFavourite ) {
      handleDeleteFavorite(userId);
    } else {
      handleAddFavorite(userId);
    }
  };

  isFavourite = (id) => {
    const { favoriteList } = this.props;
    return favoriteList.find((favUser) => favUser.id === id);
  };

  render() {
    const { userData } = this.props;
    const { filterValue } = this.state;
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: "10%",
        render: (text, record) => (
          <>
            {record && (
              <>
                <p style={{ display: "inline-block", marginLeft: 5 }}>
                  {" "}
                  {text}
                </p>
              </>
            )}
          </>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        defaultFilteredValue: this.getFilterFromLs(),
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        render: (text) => <p>{text} лет</p>,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
      },
      {
        dataIndex: "favourite",
        key: "favourite",
        render: (text, record) => (
          <>
            <SubscribeStar
              class={cn({
                "favorite-icon": !this.isFavourite(record.id),
                "favorite-icon active": this.isFavourite(record.id),
              })}
              handleClick={() => this.handleStarActive(record.id)}
            />
          </>
        ),
      },
    ];
    const tableData = {
      dataSource: userData && this.prepareTableData(userData),
      columns,
      bordered: false,
      pagination: false,
      // scroll: { y: "calc(100% - 60px)" },
    };
    return <Table {...tableData} />;
  }
}

export default UserTable;
