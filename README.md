# API-Utils



In this project, we exposed some useful back-end helper APIs:



1. #### captureHTMLScreen

   This service uses headless browser to capture any HTML page to a image file and store it into Qiniu cloud

2. #### drawQRCodeOnPicture

   This api can draw a QR code on a picture in any position you want

3. #### copyRemoteFile

   Copy any remote file to Qiniu cloud

4. #### recognize

   Convert Wechat's audio file from silk format to wav format so most voice engine can process

   

   More apis will come...

   

   ### How to use it?

   Very simple, just build a docker image by using the Dockerfile, and deploy it.

   