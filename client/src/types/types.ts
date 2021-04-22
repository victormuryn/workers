export type AccountTypes = `freelancer` | `client`;
export type MinUser = {
  _id: string,
  name: string,
  image: boolean,
  surname: string,
  username: string,
  location:{
    city: string,
    country: string,
  },
};

export type Project = {
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
    city: string,
    region: string,
    latitude: number,
    longitude: number,
  },
  category: {
    title: string,
    url: string,
  }
};

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
