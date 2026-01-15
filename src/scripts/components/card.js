import {
  removeCard,
  changeLikeCardStatus,
  getUserInfo
} from "./api";

export const likeCard = (likeButton, likeCount, data, userId) => {
  likeButton.classList.toggle("card__like-button_is-active");
  changeLikeCardStatus(data._id, isLiked(data.likes, userId))
  .then((res) => {
    data.likes = res.likes;
    likeCount.textContent = data.likes.length;
  })
  .catch((err) => {
    console.log(err);
  });
};

export const deleteCard = (cardElement, data) => {
  cardElement.remove();
  removeCard(data)
  .then((data) => console.log(data.message))
  .catch((err) => {
    console.log(err);
  });
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

function isLiked(likes, id){
  let flag = false;
  likes.forEach((user) => {flag = flag || (user._id === id)});
  return flag;
}

export const createCardElement = (
  data,
  userId,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");

  likeCount.textContent = data.likes.length;
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  if (isLiked(data.likes, userId)){
    likeButton.classList.toggle("card__like-button_is-active");
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton, likeCount, data, userId));
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement, data._id));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};
