import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        spaces: "Spaces",
        spacesDesc: "Reserve a room, laboratory or equipment",

        cafeteria: "Cafeteria",
        cafeteriaDesc: "View our weekly menu and buy tickets to try our amazing meals!",

        parking: "Parking Lot",
        parkingDesc: "Reserve a parking space for your personal vehicle or reserve one of our sustainable options",

        terminal: "Terminal",
        terminalDesc: "Learn our System-Specific language in order to perform complex tasks efficiently"
      }
    },

    pt: {
      translation: {
        spaces: "Espaços",
        spacesDesc: "Reserve uma sala, laboratório ou equipamento",

        cafeteria: "Cantina",
        cafeteriaDesc: "Veja o nosso menu semanal e compre bilhetes para experimentar as nossas refeições!",

        parking: "Estacionamento",
        parkingDesc: "Reserve um lugar para o seu veículo pessoal ou utilize uma das nossas opções sustentáveis",

        terminal: "Terminal",
        terminalDesc: "Aprenda a linguagem específica do sistema para executar tarefas complexas de forma eficiente"
      }
    }
  },

  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
