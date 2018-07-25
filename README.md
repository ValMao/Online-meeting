# A lightweight Web Video Conferencing service
This is a solution to connect anyone with an online conference room by room ID.
## Setup
#### 1. Clone or download the zip of the project,
#### 2. Install [Node.js](http://nodejs.org) 
#### 3. Open CMD or Terminal and navigate to the unzipped folder
```shell
cd path
```
#### 4.  Install dependencies in cmd/terminal
```shell
npm install
```
#### 5.  Run it

```shell
npm start
```
or
```shell
node server.js
```
## Visit this application through localhost
Please use  "https://localhost:4000" to visit this web application 

(Yes, it is HTTPS)

**Notice:** If your browser shows the link is ***not secure***, do not worry. The reason is that Facebook needs HTTPS and we are using a fake certificate to "cheat" Facebook.

For **Chorme**: click _Advanced_, then select _Proceed to localhost (unsafe)_;
For **Firexox**: click _Advances_, then click _Add Eception_, then select _confirm_;

## User our test account to login

#### Login with Facebook

Please use

email: rqin005@aucklanduni.ac.nz

password: qazxcvfrewsd

#### login with Google and Twitter

Please use 

email: aklunitester@gmail.com

password: qazxcvfrewsd

## How to use after logged in
After you logged in, you will be redirected to conference room page and the room ID will be generated automatically. 

#### For the first person (room owner):
1. Click on the "join" button.This will create a new conference room
2. Please record the current room ID in order to send/tell others to join this room. You can find the room ID at the upper right hand corner.(The room ID could be 12345678)

#### For the other persons:
1. Input the room ID (e.g. 12345678) sent by the first person in the textbox
2. Click on the "join" button (Then you will see the other people's faces in this room)

## Bugs Report
1. Room owner can not be able to rejoin if closing the user's browser tab
2. Can not communicate between different browsers on localhost(e.g. Chrome cannot see Firefox). The reason might be the camera is occupied by one browser so that other browsers can not getUserMedia 
3. Calling Mr.Trump (face mask) will cause "video mute", "audio mute" and "hang up (for room owner)" not working properly.
4. Mr.Trump (face mask) only shows on local video/screen. He should be everywhere -- it should let every one in the same room see Mr.Trump if one user "calls him".

## Acceptance Test
The test cases are included in the Acceptance_Test.docx file of this repository.