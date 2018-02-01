require('babel-polyfill');

import Adapter from 'enzyme-adapter-react-15.4';
import React from 'react';
import {App} from '../src/components/App';
import { expect } from 'chai';
import Enzyme, { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });

function setup(Component, props, store) {
 return mount(<Component {...props} store={store}  />)
}

describe('App component', () => {
  const mockStore = configureStore();
  const store = mockStore({});

 it('should render tables and control buttons', () => {
   const props = {
     asks: {},
     bids: {},
     trades: [],
     state: false
   };

  const component = setup(App, props, store);

  expect(component.find('.tables').length).to.be.equal(1);
  expect(component.find('button.start').text()).to.be.equal('Start');
  expect(component.find('button.stop').text()).to.be.equal('Stop');
 })
});