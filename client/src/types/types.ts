export type AccountTypes = `freelancer` | `client`;
export interface MinUser {
  _id: string,
  name: string,
  image: boolean,
  surname: string,
  username: string,
  location?: {
    city: string,
    country: string,
  },
}

export interface Project {
  _id: string,
  hot: boolean,
  date: string,
  title: string,
  price: number,
  views: number,
  expire: string,
  remote: boolean,
  author: MinUser,
  bets: Array<Bet>,
  description: string,
  location: {
    _id: string,
    city: string,
    region: string,
    country: string,
    latitude: number,
    longitude: number,
  },
  category: {
    _id: string,
    title: string,
    url: string,
  }[],
}

export type Bet = {
  _id: string,
  text: string,
  price: number,
  term: number,
  date: string,
  author: MinUser,
  updated: {
    count: number,
    lastDate: string,
  }
};

export type UserBet = {
  text: string,
  term: number,
  price: number,
  token: string,
  author: string,
  project: string,
};
