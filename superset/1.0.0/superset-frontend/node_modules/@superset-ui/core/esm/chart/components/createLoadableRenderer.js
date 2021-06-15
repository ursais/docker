import Loadable from 'react-loadable';
const defaultProps = {
  onRenderFailure() {},

  onRenderSuccess() {}

};
export default function createLoadableRenderer(options) {
  const LoadableRenderer = Loadable.Map(options); // Extends the behavior of LoadableComponent to provide post-render listeners

  class CustomLoadableRenderer extends LoadableRenderer {
    componentDidMount() {
      this.afterRender();
    }

    componentDidUpdate() {
      this.afterRender();
    }

    afterRender() {
      const {
        loaded,
        loading,
        error
      } = this.state;
      const {
        onRenderFailure,
        onRenderSuccess
      } = this.props;

      if (!loading) {
        if (error) {
          onRenderFailure(error);
        } else if (loaded && Object.keys(loaded).length > 0) {
          onRenderSuccess();
        }
      }
    }

  }

  CustomLoadableRenderer.defaultProps = void 0;
  CustomLoadableRenderer.defaultProps = defaultProps;
  CustomLoadableRenderer.preload = LoadableRenderer.preload;
  return CustomLoadableRenderer;
}