/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validator.js";
import { 
  getCardList,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  sendNewCard,
  getUsers
} from "./components/api.js";
import { 
  getRealUserList,
  getLikesCount,
  getLikesChampion,
  getMostPopularCards
 } from "./components/statistics.js";
import { generateModalStatsElement, refreshStatisticsWindow } from "./components/statsModal.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description"
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const cardStatsModalWindow = document.querySelector(".popup_type_info");
const openCardStatsButton = document.querySelector(".header__logo");
const cardStatsContent = cardStatsModalWindow.querySelector(".popup__content");

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const button = profileForm.querySelector(".button");
  button.textContent = "Сохранение...";
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() =>
      button.textContent = "Сохранить"
    );
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const button = avatarForm.querySelector(".button");
  button.textContent = "Сохранение...";
  setUserAvatar({avatar: avatarInput.value})
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() =>
      button.textContent = "Сохранить"
    );
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const button = cardForm.querySelector(".button");
  button.textContent = "Создание...";
  sendNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((card) => {
    placesWrap.prepend(
      createCardElement(
        card,
        card.owner._id,
        {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
        }
      )
    );
    closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() =>
      button.textContent = "Создать"
    );
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
  clearValidation(profileForm, validationSettings);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
  clearValidation(avatarForm, validationSettings);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
  clearValidation(cardForm, validationSettings);
});


openCardStatsButton.addEventListener("click", () => {
  refreshStatisticsWindow(cardStatsContent);
    Promise.all([getUsers(), getCardList()])
    .then(([userList, cardList]) => {
      const userChampion = getLikesChampion(cardList); 
      generateModalStatsElement(
        cardStatsContent,
        "Статистика карточек",
        [
          ["Всего пользователей", getRealUserList(userList, cardList).length],
          ["Всего лайков", getLikesCount(cardList)],
          ["Максимально лайков от одного", userChampion.score],
          ["Чемпион лайков", userChampion.username]
        ],
        "Популярные карточки:",
        getMostPopularCards(cardList)
      );
    })
    .catch((err) => {
      console.log(err)
    });
  openModalWindow(cardStatsModalWindow);
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

//Создание настроек валидации
const usernameValidator = (inputElement) => {
  const username = inputElement.value;
  if (username.length < 2 || username.length > 40) {
    return 1;
  }
  const re = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
  if (!re.test(username)) {
    return 1;
  }
  if (inputElement.validity.valid) {
    return 0;
  }
  return 2;
};

const descriptionValidator = (inputElement) => {
  const description = inputElement.value;
  if (description.length < 2 || description.length > 200) {
    return 1;
  }
  if (inputElement.validity.valid) {
    return 0;
  }
  return 2;
};

const cardNameValidator = (inputElement) => {
  const cardName = inputElement.value;
  if (cardName.length < 2 || cardName.length > 40) {
    return 1;
  }
  const re = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
  if (!re.test(cardName)) {
    return 1;
  }
  if (inputElement.validity.valid) {
    return 0;
  }
  return 2;
};

const linkValidator = (inputElement) => {
  const link = inputElement.value;
  const urlPattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w%\.-]*)*\/?(\?[&\w=]*)?(#[\w-]*)?$/i;
  if (!urlPattern.test(link)) {
    return 1;
  }
  if (inputElement.validity.valid) {
    return 0;
  }
  return 2;
};

const constructErrorId = (inputElement) => {
  return `#${inputElement.id}-error`;
};

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
  errorMessage: "data-error-message",
  getErrorId: constructErrorId,
  formsCount: 3,
  validators: [
    [usernameValidator, descriptionValidator],
    [cardNameValidator, linkValidator],
    [linkValidator],
  ],
};

enableValidation(validationSettings);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    console.log(cards);
    cards.forEach((data) => {
      let card=createCardElement(data, userData._id, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: (data.owner._id === userData._id) ? deleteCard : null,
        });
      if (data.owner._id !== userData._id){ 
        let deleteButton = card.querySelector(".card__control-button_type_delete");
        deleteButton.remove();
      }
      placesWrap.append(card);
    });
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
  })
  .catch((err) => {
    console.log(err); // В случае возникновения ошибки выводим её в консоль
  });


