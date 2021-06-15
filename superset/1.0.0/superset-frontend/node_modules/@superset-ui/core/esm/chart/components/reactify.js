import _pt from "prop-types";
import React from 'react'; // TODO: Note that id and className can collide between Props and ReactifyProps
// leading to (likely) unexpected behaviors. We should either require Props to not
// contain an id/className, or not combine them (via intersection), instead preferring
// wrapping (composition). As an example:
// interface MyProps {
//   id: number;
// }
// function myRender(container: HTMLDivElement, props: Readonly<MyProps>): void {
//   props.id // unusable: id is string & number
// }
// new (reactify(myRender))({ id: 5 }); // error: id has to be string & number

import { jsx as ___EmotionJSX } from "@emotion/react";
export default function reactify(renderFn, callbacks) {
  class ReactifiedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.container = void 0;
      this.setContainerRef = this.setContainerRef.bind(this);
    }

    componentDidMount() {
      this.execute();
    }

    componentDidUpdate() {
      this.execute();
    }

    componentWillUnmount() {
      this.container = undefined;

      if (callbacks != null && callbacks.componentWillUnmount) {
        callbacks.componentWillUnmount.bind(this)();
      }
    }

    setContainerRef(ref) {
      this.container = ref;
    }

    execute() {
      if (this.container) {
        renderFn(this.container, this.props);
      }
    }

    render() {
      const {
        id,
        className
      } = this.props;
      return ___EmotionJSX("div", {
        ref: this.setContainerRef,
        id: id,
        className: className
      });
    }

  }

  ReactifiedComponent.propTypes = {
    id: _pt.string,
    className: _pt.string
  };
  const ReactifiedClass = ReactifiedComponent;

  if (renderFn.displayName) {
    ReactifiedClass.displayName = renderFn.displayName;
  } // eslint-disable-next-line react/forbid-foreign-prop-types


  if (renderFn.propTypes) {
    ReactifiedClass.propTypes = { ...ReactifiedClass.propTypes,
      ...renderFn.propTypes
    };
  }

  if (renderFn.defaultProps) {
    ReactifiedClass.defaultProps = renderFn.defaultProps;
  }

  return ReactifiedComponent;
}