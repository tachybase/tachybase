// Ensure ipv4 results are returned first: https://github.com/node-red/node-red/issues/4010
import dns from 'dns';
import path from 'path';

import api from '@node-red/editor-api';
import runtime from '@node-red/runtime';
import redUtil from '@node-red/util';

let server = null;
let apiEnabled = false;

dns.setDefaultResultOrder('ipv4first');
/*
 * This module provides the full Node-RED application, with both the runtime
 * and editor components built in.
 *
 * The API this module exposes allows it to be embedded within another Node.js
 * application.
 *
 * @namespace node-red
 */
const RED = {
  /**
   * Initialise the Node-RED application.
   * @param {server} httpServer - the HTTP server object to use
   * @param {Object} userSettings - an object containing the runtime settings
   * @memberof node-red
   */
  init: function (httpServer, userSettings) {
    if (!userSettings) {
      userSettings = httpServer;
      httpServer = null;
    }

    if (!Object.prototype.hasOwnProperty.call(userSettings, 'coreNodesDir')) {
      userSettings.coreNodesDir = path.dirname(require.resolve('@node-red/nodes'));
    }
    redUtil.init(userSettings);
    if (userSettings.httpAdminRoot !== false) {
      // Initialise the runtime
      runtime.init(userSettings, httpServer, api);
      // Initialise the editor-api
      api.init(userSettings, httpServer, runtime.storage, runtime);
      // Attach the runtime admin app to the api admin app
      api.httpAdmin.use(runtime.httpAdmin);

      apiEnabled = true;
      server = httpServer;
    } else {
      runtime.init(userSettings, httpServer, api);
      apiEnabled = false;
      if (httpServer) {
        server = httpServer;
      } else {
        server = null;
      }
    }
    return;
  },
  /**
   * Start the Node-RED application.
   * @return {Promise} - resolves when complete
   * @memberof node-red
   */
  start: function () {
    // The top level red.js has always used 'otherwise' on the promise returned
    // here. This is a non-standard promise function coming from our early use
    // of the when.js library.
    // We want to remove all dependency on when.js as native Promises now exist.
    // But we have the issue that some embedders of Node-RED may have copied our
    // top-level red.js a bit too much.
    //
    return runtime.start().then(function () {
      if (apiEnabled) {
        return api.start();
      }
    });
  },
  /**
   * Stop the Node-RED application.
   *
   * Once called, Node-RED should not be restarted until the Node.JS process is
   * restarted.
   *
   * @return {Promise} - resolves when complete
   * @memberof node-red
   */
  stop: function () {
    return runtime.stop().then(function () {
      if (apiEnabled) {
        return api.stop();
      }
    });
  },

  /**
   * Logging utilities
   * @see @node-red/util_log
   * @memberof node-red
   */
  log: redUtil.log,

  /**
   * General utilities
   * @see @node-red/util_util
   * @memberof node-red
   */
  util: redUtil.util,

  /**
   * This provides access to the internal nodes module of the
   * runtime. The details of this API remain undocumented as they should not
   * be used directly.
   *
   * Most administrative actions should be performed use the runtime api
   * under [node-red.runtime]{@link node-red.runtime}.
   *
   * @memberof node-red
   */
  get nodes() {
    return runtime._.nodes;
  },

  /**
   * Runtime events emitter
   * @see @node-red/util_events
   * @memberof node-red
   */
  events: (redUtil as any).events,

  /**
   * Runtime hooks engine
   * @see @node-red/runtime_hooks
   * @memberof node-red
   */
  hooks: runtime.hooks,

  /**
   * This provides access to the internal settings module of the
   * runtime.
   *
   * @memberof node-red
   */
  get settings() {
    return runtime._.settings;
  },

  /**
   * Get the version of the runtime
   * @return {String} - the runtime version
   * @function
   * @memberof node-red
   */
  get version() {
    return runtime._.version;
  },

  /**
   * The express application for the Editor Admin API
   * @type ExpressApplication
   * @memberof node-red
   */
  get httpAdmin() {
    return api.httpAdmin;
  },

  /**
   * The express application for HTTP Nodes
   * @type ExpressApplication
   * @memberof node-red
   */
  get httpNode() {
    return runtime.httpNode;
  },

  /**
   * The HTTP Server used by the runtime
   * @type HTTPServer
   * @memberof node-red
   */
  get server() {
    return server;
  },

  /**
   * The runtime api
   * @see @node-red/runtime
   * @memberof node-red
   */
  runtime: runtime,

  /**
   * The editor authentication api.
   * @see @node-red/editor-api_auth
   * @memberof node-red
   */
  auth: api.auth,

  /**
   * The editor authentication api.
   * @see @node-red/editor-api_auth
   * @memberof node-red
   */
  get diagnostics() {
    return (api as any).diagnostics;
  },
};

export default RED;
