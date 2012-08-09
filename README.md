simple-todo-app
===============

A Simple todo app, first step to creating the dojo-todo-app

-------------------------------------------------------------------------------
Authors: Ed Chatelain, Christophe Jolif, Eric Wang, Chris Mitchell
-------------------------------------------------------------------------------
Demo description

	This demonstrates how dojox/app, dojox/mobile & dojox/mvc can be used
	together to create a real application.

-------------------------------------------------------------------------------
Dependencies:

	Dojo
	dojox/mobile
	dojox/app
	dojox/mvc

-------------------------------------------------------------------------------
Installation instructions

	Simply run the included demo.html

	To build, use the supplied demo.profile.js as your profileFile

-------------------------------------------------------------------------------
If you are using this project from github when doing a checkout you will want
to put it in the demos directory and use the name "simple-todo-app",
if a different directory name is used the themes will not work correctly. 
-------------------------------------------------------------------------------
Known Limitations:

1) This app is really only usable for tracking to do's, because all of the Reminder functions are no-op'd due to limitations.

	It's not possible to properly implement the Remind me settings without:

	a) Notification Backend to check/send the reminders on a date.
	b) No local/offline background timer process available--might be able to do this with Phonegap.
	c) Check-in/location checking mechanism/backend (plus 1 above)

	For now, these features are no-op'd

2) The items and lists are only saved in memory, so if the browser is refreshed your updates are lost.
-------------------------------------------------------------------------------
@rank:194 @categories:mobile