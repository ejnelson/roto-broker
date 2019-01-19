import React from "react";

// const OptionItemContainer = styled.li`
//   border-bottom: 1px solid #ddd;
//   padding: 10px 60px 10px 20px;
//   margin: 0 0 10px;
//   background-color: #f5f5f5;
//   list-style: none;
//   position: relative;
//   min-height: 36px;
/* box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); */
/* transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); */
/* :hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    list-style: none;
    position: relative;
    min-height: 36px;
  } */
// `;
// const ActionItem = styled.div`
//   position: absolute;
//   right: ${props => (props.right ? `${props.right}px` : "10px")};
//   top: 40%;
//   font-size: 40px;
//   transform: translateY(-50%);
//   cursor: ${props => (props.editing ? "pointer" : "move")};
// `;

class SortableItem extends React.Component {
  //   static getDerivedStateFromProps(nextProps, prevState) {
  //     if (nextProps.option.owned !== prevState.owned) {
  //       return { owned: nextProps.option.owned };
  //     }
  //     return null;
  //   }

  //   shouldComponentUpdate(nextProps, nextState) {
  //     const { owned } = this.state;
  //     const { value, option } = this.props;
  //     if (
  //       value === nextProps.value &&
  //       option.owned === owned &&
  //       nextState.owned === owned
  //     ) {
  //       return false;
  //     }
  //     return true;
  //   }

  handleChange = name => event => {
    const isChecked = event.target.checked;
    const { saveOptions, option } = this.props;
    this.setState({ [name]: isChecked });
    saveOptions(option, isChecked);
  };

  render() {
    return <div>ok</div>;
  }
}

SortableItem.propTypes = {};

export default SortableItem;
