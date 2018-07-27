# Review Questions

## What is Node.js?
    Node.js is a re-design of the traditional javascript language, built on Google's V8 engine and wrapped in C++, in order to make it available for use outside of a browser environment. It is an expansion of the Javascript language which allows it added functionality, most notably the ability to write back-end applications. 
    It is a relatively bare bones runtime environment, which works easily with a wealth of packages and frameworks in order to maintain flexibility and ease of use (in part because of it's use of Javascript as it's primary language).

## What is Express?
    Express is a framework used within the Node.js runtime environment which makes basic boilerplating and interaction with Node.js much easier. It helps with Routing, request handling and more, through simple abstraction of these processes into easy to use functions

## Mention two parts of Express that you learned about this week.
    We learned about Express Router, a quick and simple way to set up routes (endpoints) on the back end of an application, and thus create simple, to very complex API's which users can interact with, without having to directly ineract with a database. We also learned about Middleware, which is software, or functions which live between our API calls and communication with the server, and help to perform a variety of services. These can be simple routing (as react rotues are technically middleware) to data manipulation/filtering. 

## What is Middleware?
    Middleware is a part of Express that consists of small functions generally designed to do one thing really well. These functions can be easily inserted into Express routes to enhance the funcionality of Express, and provide us with services that may not come out of the box with Express, or Node.js for that matter. Middleware can come from a few different sources, including built in middleware (which we activate when needed), custom middleware (which we write ourselves when needed), and third party middleware (which the good people at [insert company here] make for us). 

## What is a Resource?
    As best I can tell, a resource is a specific subset of information available on a database, which we may want to semantically separate and deal wit on it's own. For example, in a database of e-commerce sales, the customers could be a specific resource. Customers include a specific set of information about which we would want specific routes set up, middleware to parse and user interface to deal with. It is a logical separation of information, around which we should be concerned with building access to.
## What can the API return to help clients know if a request was successful?
    The use of status codes and output messages are useful in letting clients know the status of their requests. These output messages can be in the form of simple text, JSON messages/objects or simply error code numbers.
## How can we partition our application into sub-applications?
    We can split our application in sub-applications by partitioning our routes into separate files, each of which only deals with a specific resource. 

## What is express.json() and why do we need it?
    Express.json is a piece of middleware which tells your system that you want to use JSON notation on incoming request bodies. Without this, the application would be unable to interpret any incoming reqests with JSON in the body, an error I myself experienced but 3 short days ago.  This functionality was previously held by the venerated body-parser. While this functionality can be completed without express.json or body-parser, these pieces of middleware save us a lot of time and effort by parsing a very common data format in web development.
