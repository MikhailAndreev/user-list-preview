import React, { Component } from "react";
import { Table, Avatar, Input, Space, Button, Highlighter } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const pathToImg = "@images/";

const getPicture = (file) => {
  const path = require(`../../../assets/images/${file}.svg`);
  return path.default;
};

class UserTable extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    filterValues: "",
  };

  componentDidMount() {
    const filterValues = JSON.parse(localStorage.getItem("filterValues"));
    if(filterValues) {
      console.log('from ls ', filterValues);
    }
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    console.log('from search keys', selectedKeys);
    console.log('from search index', dataIndex);
    confirm();
    localStorage.setItem("filterValues", JSON.stringify([selectedKeys[0]]));
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
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

  render() {
    const { userData } = this.props;
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
        // render: (text, record) => (
        //   <>
        //     {record && (
        //       <>
        //         <Avatar size={25} src={getPicture(record.image)} />
        //         <p style={{ display: "inline-block", marginLeft: 5 }}>
        //           {" "}
        //           {text}
        //         </p>
        //       </>
        //     )}
        //   </>
        // ),
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
    ];
    const tableData = {
      dataSource: userData && this.prepareTableData(userData),
      columns,
      bordered: false,
      pagination: false,
      // scroll: { y: "calc(100% - 60px)" },
    };
    return (
      <>
        <Table {...tableData} />
      </>
    );
  }
}

export default UserTable;
