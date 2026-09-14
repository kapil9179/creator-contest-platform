import envconfig from "../../configs/env/env.config.js";
const fetchContestData = async () => {
  const response = await fetch(
    `${envconfig.userserviceurl}/api/internal/contest/data`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch contest data. Status: ${response.status}`
    );
  }

  const result = await response.json();

  return result.data;
};

export {
  fetchContestData,
};