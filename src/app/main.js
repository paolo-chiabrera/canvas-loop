import React, {Component} from 'react';
import {Header} from './header';
import {Footer} from './footer';
import {Equalizer} from './equalizer/equalizer';

const styles = {
  container: {
    display: 'block',
    height: '100%'
  }
};

export class Main extends Component {
  render() {
    return (
      <div style={styles.container}>
        <Header/>
        <main>
          <Equalizer/>
        </main>
        <Footer/>
      </div>
    );
  }
}
