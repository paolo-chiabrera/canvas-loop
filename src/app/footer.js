import React, {Component} from 'react';

const styles = {
  footer: {
    padding: '0.4rem',
    fontSize: '1rem',
    textAlign: 'center',
    color: 'white'
  }
};

export class Footer extends Component {
  render() {
    return (
      <footer style={styles.footer}>
        Created by&nbsp;
        <a href="https://github.com/paolo-chiabrera">
          Paolo Chiabrera
        </a>
      </footer>
    );
  }
}
