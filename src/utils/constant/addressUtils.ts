export const splitAddress = (fullAddress: string | undefined) => {
  if (!fullAddress) return { base: "", detail: "" };
  const parts = fullAddress.split(" | ");
  return {
    base: parts[0] || "",
    detail: parts[1] || "",
  };
};
