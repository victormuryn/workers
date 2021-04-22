import React from 'react';

import './project-bets-list.scss';

import BetItem from '../bet-item';
import {Bet} from '../../types/types';

type Props = {
  bets: Array<Bet>,
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
