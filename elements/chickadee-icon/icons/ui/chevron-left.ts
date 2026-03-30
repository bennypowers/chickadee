const t = document.createElement('template');
t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M10 16a1 1 0 0 1 .293-.707l10-10a1 1 0 0 1 1.414 1.414L12.414 16l9.293 9.293a1 1 0 0 1-1.414 1.414l-10-10A1 1 0 0 1 10 16Z"/></svg>`;
export default t.content.firstElementChild!;
