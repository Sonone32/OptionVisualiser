import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-15';
import Enzyme from 'enzyme';
import {shallow} from 'enzyme';
import About from '../about';
import ConfigMenu from '../config-menu'
import MainPanel from '../index.jsx';

Enzyme.configure({ adapter: new Adapter() });

describe('/index.jsx', () => {
  test('Constructor', () => {
    const main = shallow(
      <MainPanel
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
      />
    );
    
    let x = main.instance().state.config;
    
    expect(x.slideableTabs).toBe(true);
    expect(x.APIClient).toBe('YAHOO');
    expect(x.model).toBe('BSM');
    expect(x.contractMultiplier).toBe(true);
  });
  
  test('Search functions', () => {
    const main = shallow(
      <MainPanel
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
      />
    );
    
    let x = main.instance();
    
    x.handleSearchChange('AM  D    ');
    x.handleSearch();
    expect(x.state.items).toEqual([[0, 'AMD']]);
    
    x.handleSearchChange('');
    x.handleSearch();
    expect(x.state.items).toEqual([[0, 'AMD']]);
    
    x.handleSearchChange(' NVd A');
    x.handleSearch();
    x.handleSearchChange('I nTC');
    x.handleSearch();
    expect(x.state.items).toEqual([[2, 'INTC'], [1, 'NVDA'], [0, 'AMD']]);
    
    x.handleKill(1);
    expect(x.state.items).toEqual([[2, 'INTC'], [0, 'AMD']]);
    
    x.handleSearchChange('AAPL');
    x.handleSearch();
    expect(x.state.items).toEqual([[3, 'AAPL'], [2, 'INTC'], [0, 'AMD']]);
  });
  
  test('Config menu', () => {
    const main = shallow(
      <MainPanel
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
      />
    );
    
    let x = main.instance(), oldConfig = x.state.config;
    
    x.handleOpenSettings();
    expect(x.state.configMenuOpen).toBe(true);
    
    x.handleSubmitSettings({
      slideableTabs: false,
      APIClient: 'GOOGLE',
      model: 'CRR',
      contractMultiplier: false,
    });
    expect(x.state.config).not.toBe(oldConfig);
    expect(x.state.config).toEqual({
      slideableTabs: false,
      APIClient: 'GOOGLE',
      model: 'CRR',
      contractMultiplier: false,
    });
    expect(x.state.configMenuOpen).toBe(false);
  });
  
  test('About dialog', () => {
    const main = shallow(
      <MainPanel
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
      />
    );
    
    let x = main.instance();
    
    expect(x.state.aboutOpen).toBe(false);
    
    x.handleOpenAbout();
    expect(x.state.aboutOpen).toBe(true);
    x.handleCloseDialog();
    
    expect(x.state.aboutOpen).toBe(false);
  });
  
  test('Notification', () => {
    const main = shallow(
      <MainPanel
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
      />
    );
    
    let x = main.instance();
    
    // Without call back
    expect(x.state.notification).toBe(false);
    
    x.handleNotification('hi', 'friend');
    expect(x.state.notification).toEqual({
      content: 'friend',
      title: 'hi',
    });
    
    x.handleCloseDialog();
    expect(x.state.notification).toBe(false);
    
    // With callback
    x.handleSearchChange('AMD');
    x.handleSearch();
    x.handleNotification('oh no', 'eenurnet', () => {x.handleKill(0)});
    expect(x.state.notification).toEqual({
      content: 'eenurnet',
      title: 'oh no',
    });
    expect(x.state.items).toEqual([]);
  });
});

describe('/about', () => {
  test('Props wiring', () => {
    const fn = () => {};
    const about = shallow(
      <About
        open={true}
        handleClose={fn}
      />
    );
    
    expect(about.props().open).toBe(true);
    expect(about.props().onRequestClose).toBe(fn);
  });
});

// More configs may be coming, but this will do for now.
describe('/config-menu.jsx', () => {
  test('componentWillReceiveProps', () => {
    const menu = shallow(
      <ConfigMenu
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
        handleSubmit={1}
        open={true}
      />
    );
    
    let x = menu.instance();
    let config = {
      slideableTabs: false,
      APIClient: 'MSN',
      model: 'CRR',
      contractMultiplier: false,
    };
    
    x.componentWillReceiveProps({
      config,
      handleSubmit: 2,
      open: false,
    });
    expect(x.state.slideableTabs).toBe(false);
    expect(x.state.APIClient).toBe('MSN');
    expect(x.state.model).toBe('CRR');
    expect(x.state.contractMultiplier).toBe(false);
    expect(x.state.handleSubmit).not.toBe(1);
    expect(x.state.open).not.toBe(true);
  });
});