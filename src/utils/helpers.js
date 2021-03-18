/* eslint-disable no-undef */
/**
 * Helpers
 */
import { find, merge, mapKeys, values, camelCase, omitBy, pickBy, isObject } from 'lodash';

/**
 * Load route and its linked viewport recursively based on array of paths
 * 
 * @param {Object} api the client to use for work
 * @param {Object} baseRoute base route
 * @param {Array} paths route paths
 */
export async function loadRoute(api, baseRoute, paths) {
  let childRoute = find(
    baseRoute.fields.childRoutes,
    r => r.fields.url.replace('/', '').toLowerCase() === paths[0].toLowerCase()
  )
  // not found or without viewport linked
  if (!childRoute || !childRoute.fields.viewport) return
  // load linked vewport
  if (paths.length === 1) {
    childRoute.fields.viewport = await api.queryEntries({
      'sys.id': childRoute.fields.viewport.sys.id,
      include: 10
    })
    return childRoute;
  } else {
    // load child route
    childRoute = await api.getEntry(childRoute.sys.id)
    paths.shift();
    return await loadRoute(api, childRoute, paths)
  }
}

/**
 * Normalizes styles object to ReactJS format (camelCase property names).
 * @param {Object} style
 * @return {Object}
 */
export function fixStyle(style) {
  const props = omitBy(style, !isObject);
  const mediaQueries = pickBy(
    style,
    (propVal, mQuery) => isObject(propVal)
    && typeof window !== 'undefined' && window.matchMedia(mQuery).matches,
  );
  const merged = merge(props, ...values(mediaQueries));
  return merged ? mapKeys(merged, (value, key) => camelCase(key)) : undefined;
}
