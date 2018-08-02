Style Guide (Draft)
===================

This is our coding style guide.  It's a draft.  It will _always be a draft_, because style guides on live codebases are never done.  For the moment, this is our best set of captured guidance on coding styles for this site. If ever that doesn't seem true, it's time to edit more!

**How to understand this guide**:

This guide doesn't (and cannot) stand on its own, it instead encourages you to find and use the best programming practices and idioms you know.  When there's meaningful choice or fork in direction, we try to set that here.  For more details on any of the practices in this guide, talk the topic through with one of the maintainers.  At present those people are: Jude, Greg, Pirijan

We're not strict about enforcing the "latest styles" on any new code, we merely ask that new code heads in the right direction.  That direction being...



Prefer Dependency Injection
---------------------------
All modules receive their dependencies as arguments to their constructor.  This is most especially true for any modules that we write, but we make exceptions for react components and stateless NPM modules.

Most importantly we should avoid passing state into a module by having that module import from a different, stateful module.

(e.g., if something wants access to the API, we should pass the API instance into it, not import the api from a global api session.)


Make the Most of ES6
--------------------
We're using it, and it's sweet!  Enjoy destructuring, ES6 classes, import/export, string literals, etc. 

Here's a nice guide to [What's New in ES6](http://es6-features.org/#Constants)

Love your Linter
----------------
ESLint is running and outputting to 'logs'.  We also have an experimental feature in place that allows ESLint to autoformat the code.  The linter is configured by src/.eslintrc.js

Write A11Y-Compliant Html
-------------------------
Our linter runs a lovely jsx-a11y plugin which does a lot of the hard work for us.  It's still on us however to respect the spirit of the linter;  it's not enough to just pass, but we also want to be conscientious about using [quality alt-tags](https://a11yproject.com/posts/alt-text/), making sure you can accomplish all UI interactions via the keyboard (which often comes down to picking the right DOM elements), etc. 

More details available at [The A11y Project](https://a11yproject.com/)

Prefer Common React Patterns
----------------------------
[React Patterns](https://reactpatterns.com/) is a great guide.  For the most part, our React code can all be written using the [stateless function pattern](https://reactpatterns.com/#stateless-function).  When we need state, we can use the [container component pattern](https://reactpatterns.com/#container-component).  It's rare that we need to build something that can't be factored out into those patterns.

Avoid Components That Think Too Hard
------------------------------------
Think about React components like you do functions.  If the component is getting to complicated, it probably needs to be decomposed.

Use React Prop-Types
--------------------
Our rule for [prop types](https://www.npmjs.com/package/prop-types) use is this:

 - Any React Component that's not a stateless function should declare all of its parameters as prop types. This is done primarily as a form of documentation for the input parameters to the component.
 
 - Any Stateless Function should define prop-types for any props _which it itself uses_, but not for any props which it merely passes directly through to sub-components.  In this manner we achieve prop-types composition across our stateless functions and maintain prop-types coverage without redundancy.
 
More
----
More to say? Add to this file.  Let's keep it to high level guidance and things that often need repeating.  Anything can be enforced by our linter instead of this doc deserves to be in the linter instead of this doc.