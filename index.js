const mainUrl = "https://cfw-takehome.developers.workers.dev/api/variants";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let response = await fetch(mainUrl);

  if (response.ok) {
    // fetch url, parse into json then randomly assign choice 0 or 1 for one of the urls
    let json = await response.json();
    let variants = json["variants"];
    let choice = Math.random() < 0.5 ? 0 : 1;
    let newResponse = await fetch(variants[choice]);

    return new HTMLRewriter() // modify html elements and content
      .on("title", new ElementHandler())
      .on("h1#title", new ElementHandler())
      .on("p#description", new ElementHandler())
      .on("a#url", new ElementHandler())
      .transform(newResponse);
  }
}

class ElementHandler {
  element(element) {
    // An incoming element, such as `div`

    if (element.tagName == "a") {
      element.setAttribute("href", "https://jerrytan.codes/");
      element.setInnerContent("My website!");
    }
    if (element.tagName == "title") {
      element.setInnerContent("Hi there!");
    }
    if (element.tagName == "h1") {
      element.setInnerContent("Jerry's Take Home Project");
    }
    if (element.tagName == "p") {
      element.setInnerContent(
        "My name is Jerry Tan and I love computer science! Check out my website!"
      );
    }

    return element;
  }
}
