const getMainStatsTemplate = () => {
  return document
    .getElementById("popup-info-definition-template")
    .content.querySelector(".popup__info-item")
    .cloneNode(true);
};

const getSecondStatsTemplate = () => {
  return document
    .getElementById("popup-info-user-preview-template")
    .content.querySelector(".popup__list-item")
    .cloneNode(true);
};

export const generateModalStatsElement = (
  contentElement,
  header1,
  mainStats,
  header2,
  secondlist
) => {
  contentElement.querySelector(".popup__title").textContent = header1;
  const info = contentElement.querySelector(".popup__info");
  mainStats.forEach(([header, value]) => {
    const stat = getMainStatsTemplate();
    stat.querySelector(".popup__info-term").textContent = header;
    stat.querySelector(".popup__info-description").textContent = value;
    info.append(stat);
  });

  contentElement.querySelector(".popup__text").textContent = header2;
  const popularCards = contentElement.querySelector(".popup__list");
  secondlist.forEach((cardName) => {
    const elem = getSecondStatsTemplate();
    elem.textContent = cardName;
    popularCards.append(elem);
  });
};

export const refreshStatisticsWindow = (contentElement) => {
  contentElement.querySelector(".popup__title").textContent = "";
  contentElement.querySelector(".popup__info").innerHTML = "";
  contentElement.querySelector(".popup__text").textContent = "";
  contentElement.querySelector(".popup__list").innerHTML = "";
};
