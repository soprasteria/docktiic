// React
import React from 'react';
import PropTypes from 'prop-types';

// Components
import NavBar from './navBar.component';
import Toasts from '../common/toasts.component';
import Modal from '../common/modal.component';

// Style
import 'semantic-ui-css/semantic.min.css';
import './common.scss';
import './flex.scss';

// App Component
class App extends React.Component {
  render = () => (
    <div className='layout vertical start-justified fill'>
      <NavBar />
      <div className='flex main layout vertical'>
        {this.props.children}
      </div>
      <Toasts />
      <Modal />
    </div>
  );
}
App.propTypes = { children: PropTypes.object };

export default App;
