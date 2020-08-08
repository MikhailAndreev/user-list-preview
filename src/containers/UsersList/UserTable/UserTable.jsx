import React, { Component } from "react";
import { Table, Avatar } from "antd";

const pathToImg = "@images/";

const getPicture = (file) => {
  const path = require(`../../../assets/images/${file}.svg`);
  return path.default;
};

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: '10%',
    render: (text, record) => (
      <>
        {record && (
          <>
            <p style={{ display: "inline-block", marginLeft: 5 }}> {text}</p>
          </>
        )}
      </>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
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

class UserTable extends Component {
  state = {
    preparedData: [],
  };

  componentDidMount() {
    this.setState({
      preparedData: this.props.userData,
    });
  }



  render() {
    const { userData } = this.props;
    return (
      <>
        <Table columns={columns} dataSource={userData} />
      </>
    );
  }
}

export default UserTable;
