// import React from 'react';
// import renderer from 'react-test-renderer';
// import {BrowserRouter as Router} from 'react-router-dom';
// import App from './app';
//
// // jest.mock('react-redux', () => {
// //   const ActualReactRedux = jest.requireActual('react-redux');
// //   return {
// //     ...ActualReactRedux,
// //     useSelector: jest.fn().mockImplementation(() => {
// //       return {user: {}};
// //     }),
// //
// //     useDispatch: jest.fn().mockImplementation(() => {
// //       return () => {};
// //     }),
// //   };
// // });
//
// describe(`App tests`, () => {
//   it(`App not authenticated renders corrects`, () => {
//
//     const tree = renderer.create(<App/>).toJSON();
//
//     expect(tree).toMatchSnapshot();
//   });
//
//   // it(`App authenticated renders corrects`, () => {
//   //   jest.mock('react-redux', () => {
//   //     const ActualReactRedux = jest.requireActual('react-redux');
//   //     return {
//   //       ...ActualReactRedux,
//   //       useSelector: jest.fn().mockImplementation(() => {
//   //         return {
//   //           user: {
//   //             isAuthenticated: true,
//   //           },
//   //         };
//   //       }),
//   //
//   //       useDispatch: jest.fn().mockImplementation(() => {
//   //         return () => {};
//   //       }),
//   //     };
//   //   });
//   //
//   //   const tree = renderer.create(<Router><App /></Router>).toJSON();
//   //
//   //   expect(tree).toMatchSnapshot();
//   // });
// });
