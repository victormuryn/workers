import React from 'react';

import './project-bets-list.scss';

import BetItem from '../bet-item';

type User = {
  _id: string,
  name: string,
  image: boolean,
  surname: string,
  username: string,
}

type Bets = Array<{
  _id: string,
  text: string,
  price: number,
  term: number,
  date: string,
  author: string,
  betAuthor: User,
  updated: {
    count: number,
    lastDate?: string,
  }
}>;

type Props = {
  bets: Bets,
  deleteClickHandler: (e: React.MouseEvent, id: string) => void,
}

const ProjectBetsList: React.FC<Props> = ({bets, deleteClickHandler}) => {
  return <>
    {
      bets.map((bet) =>
        <BetItem
          {...bet}
          key={bet._id}
          onDeleteClick={
            (e: React.MouseEvent) => deleteClickHandler(e, bet._id)
          }
        />,
      )
    }
  </>;
};

export default ProjectBetsList;
