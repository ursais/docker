import { isUnaryOperator, isBinaryOperator, isSetOperator } from './Operator';
//---------------------------------------------------
// Type guards
//---------------------------------------------------
export function isSimpleAdhocFilter(filter) {
  return filter.expressionType === 'SIMPLE';
}
export function isUnaryAdhocFilter(filter) {
  return isUnaryOperator(filter.operator);
}
export function isBinaryAdhocFilter(filter) {
  return isBinaryOperator(filter.operator);
}
export function isSetAdhocFilter(filter) {
  return isSetOperator(filter.operator);
}