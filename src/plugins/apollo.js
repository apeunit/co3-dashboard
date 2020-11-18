"use strict";

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const LISTENER_URL           = process.env.VUE_APP_LISTENER_URL
const _apollo = new ApolloClient({
  link: new HttpLink({ uri: LISTENER_URL}),
  // Using a cache for blazingly
  // fast subsequent queries.
  cache: new InMemoryCache(),
});
console.log('apollo')
export default {
  install: function(Vue) {
    console.log('apollo install')
    Vue.apollo = _apollo;
    window.apollo = _apollo;
    Object.defineProperties(Vue.prototype, {
      apollo: {
        get() {
          return _apollo;
        }
      },
      $apollo: {
        get() {
          return _apollo;
        }
      },
    });
  }
}
