export function fitToViewport(elementSizes: { height: number; width: number }, viewPortSizes: { height: number; width: number }) {
  // Calculate scale factors for width and height
  const widthScale = viewPortSizes.width / elementSizes.width;
  const heightScale = viewPortSizes.height / elementSizes.height;

  // Use the smaller scale to ensure both dimensions fit
  const scale = Math.min(widthScale, heightScale);

  // Calculate new dimensions
  const newWidth = elementSizes.width * scale;
  const newHeight = elementSizes.height * scale;

  return { width: newWidth, height: newHeight };
}
