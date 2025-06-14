---
title: 'Using MDX'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 02 2022'
heroImage: '/og-image.png'
group : "AI"
---

import Placeholder from "../../components/blog/CodeBlock/index.astro"
import ShowCase from "../../components/blog/ShowCase/index.astro"
import LinkPreview from "../../components/LinkPreview/index.astro"


This theme comes with the [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) integration installed and configured in your `astro.config.mjs` config file. If you prefer not to use MDX, you can disable support by removing the integration from your config file.

## Why MDX?


 <LinkPreview 
    url="https://aws.amazon.com/blogs/opensource/introducing-strands-agents"
    imageSrc={getImagePromise("/strands/thumbnail.png")}
    width={300}
    height={150}
  >
    🚀 Read the AWS Blog Post
  </LinkPreview>

  or 
for dynamic loading image
   <LinkPreview 
    url="https://aws.amazon.com/blogs/opensource/introducing-strands-agents"
    width={300}
    height={150}
  >
    🚀 Read the AWS Blog Post
  </LinkPreview>

To use images in your MDX files, you can use the standard Markdown syntax or HTML img tag:

![hero image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCy16nhIbV3pI1qLYHMJKwbH2458oiC9EmA&s)
Choose the method that best suits your needs. The Image component offers optimizations but requires an import.

MDX is a special flavor of Markdown that supports embedded JavaScript & JSX syntax. This unlocks the ability to [mix JavaScript and UI Components into your Markdown content](https://docs.astro.build/en/guides/markdown-content/#mdx-features) for things like interactive charts or alerts.

If you have existing content authored in MDX, this integration will hopefully make migrating to Astro a breeze.


### How mdx is good

this is the mdx and this is the greatest mdx


# H1

asdsad

## H2

sadsdasd

### H3

asd

#### H4

sadsda

##### H5

asdasd



<ShowCase content={["list item 1", "list item 2", "list item 3"]} type="danger" client:load/>


###### H6

asdsadsad

<Placeholder>

```js showLineNumbers {1-3} /The result is/ caption="some js code" title="title.JS"
console.log("Hello world!");

// highlight-start
const greeting = "Hello, ";
const name = "Developer";
console.log(greeting + name);
// highlight-end

function add(a, b) {
  return a + b;
}

// This is a comment
const result = add(5, 3);
console.log(`The result is: ${result}`);
```

```python title="bar.py"
console.log("python")
```

```python title="bar2.py"
console.log("python")
```
</Placeholder>

## Example

Here is how you import and use a UI component inside of MDX.  
When you open this page in the browser, you should see the clickable button below.



## More Links

- [MDX Syntax Documentation](https://mdxjs.com/docs/what-is-mdx)
- [Astro Usage Documentation](https://docs.astro.build/en/guides/markdown-content/#markdown-and-mdx-pages)
- **Note:** [Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives) are still required to create interactive components. Otherwise, all components in your MDX will render as static HTML (no JavaScript) by default.../../components/blog/ShowCase/ShowCase.tsx
