/**
 * APIs for fetching data from Contentful
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ApiService from 'services/contentful';
import { isObject } from 'lodash';

/**
 * Decides on status code based on error object from Contentful
 * @param {Object} error
 * @returns {Integer}
 */
function getStatusCode(error) {
  if (!error || !isObject(error) || !error.sys || !error.sys.id) return 500;
  switch (error.sys.id) {
    case 'NotFound': return 404;
    default: return 500;
  }
}

/** The API endpoints handler */
export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req

  const api = new ApiService(
    process.env.CONTENTFUL_CDN_API_KEY,
    process.env.CONTENTFUL_SPACE_ID,
  )

  switch (method) {
    // get entry by ID
    case 'GET':
      try {
        const entry = await api.getEntry(id);
        res.json(entry)
      } catch(error) {
        res.status(getStatusCode(error)).json(error)
      }
      break;
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
