import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';


class AdminHomePage extends Component {

  // 1. Jelentkezett-e már turnusra?
  //  NEM->Ha nem, akkor a turnus választó jön be
  // 2. A turnus állapota oldal jön be

  render() {
    return (
      <div>
        <h2>Helló Admin!</h2>

      </div>
    );
  }
}

export default AdminHomePage;
