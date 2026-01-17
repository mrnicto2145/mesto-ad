function checkNonDefaultUser(user) {
  return (
    user.name !== "Jacques Cousteau" ||
    user.about !== "Sailor, researcher" ||
    user.avatar !==
      "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg"
  );
}

export const getRealUserList = (usersList, cardList) => {
  let userList = [];
  usersList.forEach((user) => {
    if (checkNonDefaultUser(user)) {
      userList.push(user._id);
    }
  });
  cardList.forEach((card) => {
    card.likes.forEach((user) => {
      if (!userList.includes(user._id)) {
        userList.push(user._id);
      }
    });
    if (!userList.includes(card.owner._id)) {
      userList.push(card.owner._id);
    }
  });
  return userList;
};

export const getLikesCount = (cardList) => {
  let likeCounter = 0;
  cardList.forEach((card) => (likeCounter += card.likes.length));
  return likeCounter;
};

export const getLikesChampion = (cardList) => {
  let champions = new Map();
  let users = new Map();
  cardList.forEach((card) => {
    card.likes.forEach((user) => {
      if (champions.has(user._id)) {
        champions.set(user._id, champions.get(user._id) + 1);
      } else {
        champions.set(user._id, 1);
        users.set(user._id, user.name);
      }
    });
  });
  let leader;
  let score = -1;
  for (let [userId, userScore] of champions) {
    if (userScore > score) {
      leader = userId;
      score = userScore;
    }
  }
  return {
    username: users.get(leader),
    score: score,
  };
};

export const getMostPopularCards = (cardList) => {
  let champions = new Map();
  let cardNames = new Map();
  cardList.forEach((card) => {
    champions.set(card._id, card.likes.length);
    cardNames.set(card._id, card.name);
  });
  let winners = [
    ["0", 0],
    ["0", 0],
    ["0", 0],
  ];
  for (let [id, currentScore] of champions) {
    if (currentScore > winners[2][1]) {
      winners[2] = [id, currentScore];
      if (winners[2][1] > winners[1][1]) {
        let temp = winners[2];
        winners[2] = winners[1];
        winners[1] = temp;
        if (winners[1][1] > winners[0][1]) {
          let temp = winners[1];
          winners[1] = winners[0];
          winners[0] = temp;
        }
      }
    }
  }
  return [
    cardNames.get(winners[0][0]),
    cardNames.get(winners[1][0]),
    cardNames.get(winners[2][0]),
  ];
};
