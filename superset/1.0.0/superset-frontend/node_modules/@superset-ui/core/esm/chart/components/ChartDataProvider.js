import _pt from "prop-types";

/* eslint react/sort-comp: 'off' */
import React from 'react';
import ChartClient from '../clients/ChartClient';

class ChartDataProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.chartClient = void 0;

    this.handleFetchData = () => {
      const {
        loadDatasource,
        formDataRequestOptions,
        datasourceRequestOptions,
        queryRequestOptions
      } = this.props;
      this.setState({
        status: 'loading'
      }, () => {
        try {
          this.chartClient.loadFormData(this.extractSliceIdAndFormData(), formDataRequestOptions).then(formData => Promise.all([loadDatasource ? this.chartClient.loadDatasource(formData.datasource, datasourceRequestOptions) : Promise.resolve(undefined), this.chartClient.loadQueryData(formData, queryRequestOptions)]).then(([datasource, queriesData]) => ( // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          {
            datasource,
            formData,
            queriesData
          }))).then(this.handleReceiveData).catch(this.handleError);
        } catch (error) {
          this.handleError(error);
        }
      });
    };

    this.handleReceiveData = payload => {
      const {
        onLoaded
      } = this.props;
      if (onLoaded) onLoaded(payload);
      this.setState({
        payload,
        status: 'loaded'
      });
    };

    this.handleError = error => {
      const {
        onError
      } = this.props;
      if (onError) onError(error);
      this.setState({
        error,
        status: 'error'
      });
    };

    this.state = {
      status: 'uninitialized'
    };
    this.chartClient = new ChartClient({
      client: props.client
    });
  }

  componentDidMount() {
    this.handleFetchData();
  }

  componentDidUpdate(prevProps) {
    const {
      formData,
      sliceId
    } = this.props;

    if (formData !== prevProps.formData || sliceId !== prevProps.sliceId) {
      this.handleFetchData();
    }
  }

  extractSliceIdAndFormData() {
    const {
      formData,
      sliceId
    } = this.props;
    return formData ? {
      formData
    } : {
      sliceId: sliceId
    };
  }

  render() {
    const {
      children
    } = this.props;
    const {
      status,
      payload,
      error
    } = this.state;

    switch (status) {
      case 'loading':
        return children({
          loading: true
        });

      case 'loaded':
        return children({
          payload
        });

      case 'error':
        return children({
          error
        });

      case 'uninitialized':
      default:
        return null;
    }
  }

}

ChartDataProvider.propTypes = {
  children: _pt.func.isRequired,
  loadDatasource: _pt.bool,
  onError: _pt.func,
  onLoaded: _pt.func
};
export default ChartDataProvider;