import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';

const ScrollToTop: React.ComponentClass = withRouter(({history}) => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      unlisten();
    };
  }, []);

  return null;
});

export default ScrollToTop;
