export const measureElementHeight = (element: HTMLElement): number => {
    const originalStyle = element.style.cssText;
    element.style.maxHeight = 'none';
    element.style.height = 'auto';
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.position = 'absolute';
    element.style.zIndex = '-1';

    const height = element.scrollHeight;

    element.style.cssText = originalStyle;

    return height;
};