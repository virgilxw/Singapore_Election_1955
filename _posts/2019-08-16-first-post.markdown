---
layout: post
title:  "First Post"
date:   2019-08-16 02:43:42 +0800
categories: major update
---

I have spent the last couple of days working on two things:

1. The table displaying the results of each constituency
2. This blog

# Result tables
![What was implemented](/assets/blog_assets/2019-8-16-results.PNG)

This is a core function of the website that needed to be implemented early on in the development process.

I considered two ways to show the results of specific divisions to the user. The first and more straightforward way was to create a sidebar or container which displayed the results of a chosen division. The second, which was the one I went with, was to use Leaflet's popup function to generate a popup directly over the centroid of the selected division.

(n.b. the use of "division" may be considered synonymous with "constituency" or "ward". There was a compelling reason to use this precise word to describe the geographical area a member of the legislative assembly represents, but I'll leave this discussion for another blog post.) 

## Design
I chose the popup as a matter of design; I did not want the users' eyeballs to have to jump all over the screen. This option changes the map to fit the viewing needs of the user.

It's also more dynamic and intuitive for a set of results to be displayed directly over a geographical map of the division. Three things happen when a user clicks on the polygon of a division.

At any rate, this decision was made when I started using the aside (sidebar) of the website to display a data visualisation of the overall results of the election. I'll talk more about that when I finish that.

## Implementation
Having to jump between python and Javascript for parsing the raw CSV data from data.gov.sg into JSON and turning that JSON into an HTML table was mildly annoying. But it just took more time than it should have taken. Only in debugging, though, did I realised it was much easier to use one language for all the mathematical operations. I had to sort candidates by descending vote count and converting vote_percentage to a two decimal place string.

That problem seems like a pretty straightforward, right? But I spent an embarrassing amount of time 1) first using the vote_percentage as my sorting key, 2) trying to print vote_percentage as a two decimal string only to realise converting the float into a string caused the sorting mentioned in part 1) to fail. I know how to solve it now, but it's still bugged. But it's a relatively minor bug, so I'll get back to it when I get the time.

Also: I tried to get all fancy and learn how to use R and Pandas to parse the data. In the end, I just resorted to vanilla Python; the data set was small, and I really cannot afford the extra time needed to either re-learn R or learn Pandas. So lesson learnt there: use only the tools you need.

## Todo
- Fix the two decimal place problem of vote_percentage
- Add in number of electors, type of constituency (Rural/ Urban/ Mixed), turnout
- Find pictures of all the candidates to put alongside the result
- The css styling of the popup can be improved.

# This blog
I did spend about two days learning the basics of Jekyll, though. But I thought Jekyll would be a better way to manage all the different elements of this site - while integrating a native blog that interoperates with the rest of the website. It's working now; the map is implemented in Jekyll. This blog is quite ugly, but that's fine for now. It's not important to the front-facing website, and it is only really used for grading purposes. So presumably it shouldn't matter if the blog looks like it is the homepage of a computer science professor instead of being made on Squarespace.