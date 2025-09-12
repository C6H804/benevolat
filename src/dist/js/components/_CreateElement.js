export function CreateElement(tag,  attributes = {}, children = []) {
    // create the element with the specified tag
    const element = document.createElement(tag);

    // set attributes on the element
    for (let [key, value] of Object.entries(attributes)) {
        if (key === "className") {
            element.className = value;
        } else {
            element.setAttribute(key, value);
        }
    }

    // append children to the element
    children.forEach(child => {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}