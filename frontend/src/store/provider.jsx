import { Provider } from 'react-redux';

import store from './index.js';

function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
