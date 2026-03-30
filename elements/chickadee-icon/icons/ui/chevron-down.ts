const t = document.createElement('template');
t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 22a1 1 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414L16 19.586l9.293-9.293a1 1 0 0 1 1.414 1.414l-10 10A1 1 0 0 1 16 22Z"/></svg>`;
export default t.content.firstElementChild!;
