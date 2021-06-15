import { isBinaryAdhocFilter, isUnaryAdhocFilter } from './types/Filter';
export default function convertFilter(filter) {
  const {
    subject
  } = filter;

  if (isUnaryAdhocFilter(filter)) {
    const {
      operator
    } = filter;
    return {
      col: subject,
      op: operator
    };
  }

  if (isBinaryAdhocFilter(filter)) {
    const {
      operator
    } = filter;
    return {
      col: subject,
      op: operator,
      val: filter.comparator
    };
  }

  const {
    operator
  } = filter;
  return {
    col: subject,
    op: operator,
    val: filter.comparator
  };
}