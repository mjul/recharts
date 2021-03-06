/**
 * @fileOverview Wrapper component to make charts adapt to the size of parent * DOM
 */
import React, { Component, PropTypes } from 'react';
import pureRender from '../util/PureRender';
import { getPercentValue, isPercent } from '../util/DataUtils';
import { getWidth, getHeight } from '../util/DOMUtils';
import { warn } from '../util/LogUtils';

@pureRender
class ResponsiveContainer extends Component {
  static displayName = 'ResponsiveContainer';

  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.node,
  };

  static defaultProps = {
    width: '100%',
    height: '100%',
  };

  state = {
    hasInitialized: false,
  };

  componentDidMount() {
    this.updateSizeOfWrapper();
    window.addEventListener('resize', this.updateSizeOfWrapper);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSizeOfWrapper);
  }

  updateSizeOfWrapper = () => {
    const { width, height } = this.props;
    const container = this.refs.container;
    const clientWidth = getWidth(container);
    const clientHeight = getHeight(container);

    this.setState({
      hasInitialized: true,
      width: getPercentValue(width, clientWidth),
      height: getPercentValue(height, clientHeight),
    });
  };

  render() {
    const { hasInitialized, width, height } = this.state;
    const { children } = this.props;
    const style = {
      width: '100%',
      height: '100%',
    };

    warn(isPercent(this.props.width) || isPercent(this.props.height),
      `The width(%s) and height(%s) are both fixed number,
       maybe you don't need to use ResponsiveContainer.`,
      this.props.width, this.props.height
    );

    if (hasInitialized) {
      warn(width > 0 && height > 0,
        `The width(%s) and height(%s) of chart should be greater than 0,
        please check the style of container, or the props width(%s) and height(%s).`,
        width, height, this.props.width, this.props.height
      );
    }

    return (
      <div className="recharts-responsive-container" style={style} ref="container">
        {
          hasInitialized && width > 0 && height > 0 ?
          React.cloneElement(children, { width, height }) :
          null
        }
      </div>
    );
  }
}

export default ResponsiveContainer;
