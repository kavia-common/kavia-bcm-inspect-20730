export const getRandomColor = () => {
  let color;
  const brightnessThreshold = 150;
  let brightness;

  do {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    color = `rgb(${r}, ${g}, ${b})`;

    brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  } while (brightness > brightnessThreshold);

  return color;
};

export const handleChange = (handleExpand: any) => {
  return (event: any, isExpand: boolean) => {
    if (isExpand) {
        handleExpand()
    }
  };
};
