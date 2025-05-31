import axios from "axios";

const API_BASE_URL = "https://lovable-horses-1f1c111d86.strapiapp.com/src/api"; // URL del backend Strapi

export const getCompetenze = async () => {
  const res = await axios.get(`${API_BASE_URL}/competenzas`);
  return res.data.data;
};

export const updateCompetenzeCandidato = async (candidatoId: number, competenzaIds: number[], token: string) => {
  return axios.put(
    `${API_BASE_URL}/candidatoes/${candidatoId}`,
    {
      data: {
        competenzas: competenzaIds
      }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
