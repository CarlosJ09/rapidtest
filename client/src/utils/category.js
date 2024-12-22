export const color = (category, isHover) => {
  if (category === "Math") return isHover ? "hover:bg-red-300" : "bg-red-300";
  if (category === "Literature") return isHover ? "hover:bg-acent" : "bg-acent";
  if (category === "Science") return isHover ? "hover:bg-green-300" : "bg-green-300";
  if (category === "History") return isHover ? "hover:bg-purple-300" : "bg-purple-300";
  if (category === "Programming") return isHover ? "hover:bg-orange-300" : "bg-orange-300";
  return isHover ? "hover:bg-primary" : "bg-primary";
};
