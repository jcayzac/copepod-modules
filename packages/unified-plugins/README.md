# `@jcayzac/unified-plugins`

> [!WARNING]
> This package is not (yet?) meant for public use.
> It doesn't follow semantic versioning. It is part of a larger project and is published for internal use only.

## Remark Preset

```ts
import * as presets from '@jcayzac/unified-plugins'

const remarkPlugins = [
  ...otherPlugins,
  ...presets.remark({
    /* options */
  }),
]

// Use remarkPlugins in your unified processor
```

### Linkified headings

All headings are automatically given an `id` attribute based on their text content, and their children are wrapped in a link to that id.

### Unwrapping of "loner" elements

Elements that are the only child of a paragraph are unwrapped from the paragraph if they can be block elements. This includes the following elements:

**HTML (or JSX):**

* `<iframe>`
* `<img>`.
* `<figcaption>`
* `<picture>`
* `<video>`

**Markdown:**

* `image` elements.
* `link` elements that are recognized by a link transform (see below).

### Link transforms

Lone links whose URL is recognized by a registered link transform can be altered or transformed into another element.

A link transform conforms to the following interface:

```ts
interface LinkTransform {
  // The name of the transform, e.g. `youtube`.
  readonly name: string
  // A regular expression a link's URL must match.
  readonly detect: RegExp
  // Names for captured groups.
  readonly groups?: (string | undefined)[]
  // The transform function.
  readonly transform: (link: Link, ...captured: (string | undefined)[]) => Parent | undefined
}
```

`transform()` may just add or change properties on the link, or return a completely new element to replace it.

If the `baseline.links.componentRoutes` option is set and contains an entry for `name`, or if the `baseline.links.defaultComponent` option is set, the link will be replaced by an MDX component and the `transform()` function ignored.

In addition to `url` and `title`, captured groups with a corresponding name in `groups` are also passed as props to the MDX component, as well as an `args` prop containing all captured groups.

> [!TIP]
> In order for an MDX component to be available, in must also be registered in the MDX provider.

By default, the following link transforms are registered:

* `codepen`: Transforms CodePen URLs into responsive iframes loaded lazily.
Captured groups:
  * `owner`: The pen's owner.
  * `pen`: The pen's id.
* `youtube`: Transforms YouTube video URLs into responsive iframes loaded lazily.
Captured groups:
  * `id`: The video ID.

You can override the default transforms, or register new ones, by setting the `baseline.links.transforms` option.

> [!NOTE]
> Markdown links often don't have titles. When a link doesn't have one, the preset automatically sets it to the element's text content before it passes it down to the `transform()` function or an MDX component.

### Asides

GFM-style asides are supported.

```md
> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
```

Arbitrary aside types are also supported, for instance:

```md
> [!COOKING_TIP]
> A tip for cooking.
```

Asides are converted to `<aside>` elements in rehype. They have a class list that includes `aside` and `aside-<type>`, where `<type>` is the aside type in lowercase.

The aside type is also available in the `data` attribute of the mdast node, as well as in the `data-type` attribute set in the rehype node.

A title can be passed as an argument to the aside type:

```md
> [!TIP: I bet you didn't know this!]
```

Titles are not inserted into the tree, but are available in the `data` attribute of the mdast node as well as in the `data-title` attribute of the rehype node.

### _"Double blockquotes"_ `>>` syntax for figure captions

```md
![Alt text](image.jpg)
>> Image caption.
>>
>> Another paragraph in the caption.
```

The outter blockquote is converted to a `<figcaption>` in rehype. The inner one is removed, and its children attached to the outter one instead.

### Captioning of block elements

Block elements followed by a caption are wrapped in a `<figure>` element with a `<figcaption>` child.

The caption element must be at the same level as the block element, and must be a block element itself. It can be a raw `<figcaption>` or any element marked to be converted to a `<figcaption>` in rehype.

````md
```js
console.log('Hello, world!')
```

<figcaption>This is a code block.</figcaption>
````

````md
```js
console.log('Hello, world!')
```

>>This is a code block.
````

```md
[A video about pandas](https://youtu.be/dqT-UlYlg1s?si=90AKHyMJG_6TLV9p)
>> A video about pandas.
```

### Math

[`remark-math`](https://github.com/remarkjs/remark-math) is included in the preset.

## Rehype Preset

```ts
import * as presets from '@jcayzac/unified-plugins'

const rehypePlugins = [
  ...otherPlugins,
  ...presets.rehype({
    /* options */
  }),
]

// Use rehypePlugins in your unified processor
```

### Whitespace Cleaning

* Paragraphs are trimmed.
* Empty paragraphs are removed.

### Math Typesetting

[`rehype-katex`](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex#rehype-katex) is included in the preset.
