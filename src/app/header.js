import React, {Component} from 'react';

const styles = {
  title: {
    padding: '0.5rem',
    fontSize: '1.2rem',
    margin: 0
  }
};

export class Header extends Component {
  render() {
    return (
      <header style={styles.header}>
        <p style={styles.title}>
          <a href="/">
            Canvas Loop
          </a>
        </p>
      </header>
    );
  }
}
