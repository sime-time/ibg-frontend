export const classButtonStyle = (martialArt: string) => {
  const baseStyle = "w-full btn btn-sm btn-block bg-opacity-50";
  switch (martialArt) {
    case "BOX":
      return `${baseStyle} btn-primary`;
    case "BJJ":
      return `${baseStyle} btn-secondary`;
    case "MMA":
      return `${baseStyle} btn-primary text-purple-200 bg-purple-600 border-purple-700 bg-opacity-30 focus:bg-purple-700 hover:bg-purple-700 hover:border-purple-700`;
    case "UBOX":
      return `${baseStyle} btn-primary`;
    case "COMPBOX":
      return `${baseStyle} btn-primary`;
    default:
      return `${baseStyle} btn-neutral`;
  }
};

export const fullClassName = (martialArt: string) => {
  switch (martialArt) {
    case "BOX":
      return "Boxing";
    case "BJJ":
      return "Jiu-Jitsu";
    case "MMA":
      return "MMA";
    case "UBOX":
      return "Unlim. Boxing";
    case "COMPBOX":
      return "Comp. Boxing";
    default:
      return "Open Gym";
  }
};
