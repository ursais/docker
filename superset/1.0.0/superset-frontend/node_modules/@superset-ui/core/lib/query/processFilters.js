"use strict";

exports.__esModule = true;
exports.default = processFilters;

var _Filter = require("./types/Filter");

var _convertFilter = _interopRequireDefault(require("./convertFilter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable camelcase */

/** Logic formerly in viz.py's process_query_filters */
function processFilters(formData) {
  // Split adhoc_filters into four fields according to
  // (1) clause (WHERE or HAVING)
  // (2) expressionType
  //     2.1 SIMPLE (subject + operator + comparator)
  //     2.2 SQL (freeform SQL expression))
  const {
    adhoc_filters,
    extras = {},
    filters = [],
    where
  } = formData;
  const simpleWhere = filters;
  const simpleHaving = [];
  const freeformWhere = [];
  if (where) freeformWhere.push(where);
  const freeformHaving = [];
  (adhoc_filters || []).forEach(filter => {
    const {
      clause
    } = filter;

    if ((0, _Filter.isSimpleAdhocFilter)(filter)) {
      const filterClause = (0, _convertFilter.default)(filter);

      if (clause === 'WHERE') {
        simpleWhere.push(filterClause);
      } else {
        simpleHaving.push(filterClause);
      }
    } else {
      const {
        sqlExpression
      } = filter;

      if (clause === 'WHERE') {
        freeformWhere.push(sqlExpression);
      } else {
        freeformHaving.push(sqlExpression);
      }
    }
  }); // some filter-related fields need to go in `extras`

  extras.having = freeformHaving.map(exp => `(${exp})`).join(' AND ');
  extras.having_druid = simpleHaving;
  extras.where = freeformWhere.map(exp => `(${exp})`).join(' AND ');
  return {
    filters: simpleWhere,
    extras
  };
}