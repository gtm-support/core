export function resetHtml(): void {
  const html: HTMLHtmlElement = document.getElementsByTagName(
    'html',
  )[0] as unknown as HTMLHtmlElement;
  html.innerHTML = '';
}

export function resetDataLayer(dataLayerName = 'dataLayer'): void {
  delete window[dataLayerName];
}
