export const formatDate = (dateString: string): string => {
  const [day, month] = dateString.split("/");
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}`;
};
