/**
 * Contentful service
 */

import { createClient } from 'contentful';
/**
 * Auxiliary class that handles communication with Contentful CDN and preview
 * APIs in the same uniform manner.
 */
class ApiService {
  /**
   * Creates a new service instance.
   * @param {String} apiKey API key.
   * @param {String} spaceId The space id.
   * @param {String} environment Defaults to master
   * @param {Boolean} preview Use the preview API?
   */
  constructor(apiKey, spaceId, environment = 'master', preview) {
    // client config
    const clientConf = {
      accessToken: apiKey,
      space: spaceId,
      environment
    };
    if (preview) clientConf.host = 'preview.contentful.com';
    // create the client to work with
    this.client = createClient(clientConf);
  }

  /**
   * Gets the specified asset.
   * @param {String} id Asset ID.
   * @return {Promise}
   */
  async getAsset(id) {
    const res = await this.client.getAsset(id);
    return res.stringifySafe ? JSON.parse(res.stringifySafe()) : res;
  }

  /**
   * Gets the specified content entry.
   * @param {String} id Entry ID.
   * @return {Promise}
   */
  async getEntry(id) {
    const res = await this.client.getEntry(id);
    return res.stringifySafe ? JSON.parse(res.stringifySafe()) : res;
  }

  /**
   * Queries assets.
   * @param {Object} query Optional. Query.
   * @return {Promise}
   */
  async queryAssets(query) {
    const res = await this.client.getAssets(query);
    return res.stringifySafe ? JSON.parse(res.stringifySafe()) : res;
  }

  /**
   * Gets an array of content entries.
   * @param {Object} query Optional. Query for filtering / sorting of entries.
   * @return {Promise}
   */
  async queryEntries(query) {
    const res = await this.client.getEntries(query);
    return res.stringifySafe ? JSON.parse(res.stringifySafe()) : res;
  }
}

export default ApiService
